/* PERMATA - kalkulasi kesiapan PROPER & scoring */
(function (global) {
  const P = global.PERMATA = global.PERMATA || {};
  const data = P.data;
  const proper = P.proper;

  function isDefaultScope(scope) {
    return scope.period === '2025/2026' && scope.facility === 'tbbm-a';
  }

  function thresholdFor(scope) {
    const pIdx = Math.max(0, data.HISTORY_PERIODS.indexOf(scope.period));
    const fIdx = Math.max(0, data.facilities.findIndex(f => f.id === scope.facility));
    return 0.15 + (pIdx * 0.12) + ((fIdx % 5) * 0.05);
  }

  function effectiveStatus(indicator, scope, raw) {
    if (!raw && P.state) {
      const override = P.state.indicatorOverride(indicator.id);
      if (override) return override;
    }
    if (isDefaultScope(scope)) return indicator.status;
    const threshold = thresholdFor(scope);
    const h = data.hash2(scope.period + '|' + scope.facility + '|' + indicator.id);
    if (h < threshold * 0.22) return 'revisi';
    if (h < threshold) return 'pending';
    return 'verified';
  }

  function indicatorStats(criterion, scope, raw) {
    let total = 0;
    let verified = 0;
    let pending = 0;
    let revisi = 0;
    let empty = 0;

    criterion.indicators.forEach(ind => {
      total += ind.weight;
      const status = effectiveStatus(ind, scope, raw);
      if (status === 'verified') verified += ind.weight;
      else if (status === 'pending') pending += ind.weight;
      else if (status === 'revisi') revisi += ind.weight;
      else empty += ind.weight;
    });

    // Otomatis integrasikan input penerapan pengguna ke skor kesiapan
    if (!raw && P.state && P.state.implementationsFor) {
      const userImpls = P.state.implementationsFor(criterion.id);
      userImpls.forEach(impl => {
        const boost = impl.status === 'in_process' ? 15 : 25;
        verified = Math.min(total, verified + boost);
      });
    }

    return {
      total,
      verified,
      pending,
      revisi,
      empty,
      count: criterion.indicators.length,
      verifiedCount: Math.min(criterion.indicators.length, Math.ceil((verified / (total || 1)) * criterion.indicators.length))
    };
  }

  function criterionScore(criterion, scope, raw) {
    const s = indicatorStats(criterion, scope, raw);
    return s.total ? Math.round((s.verified / s.total) * 100) : 0;
  }

  function criterionStatus(criterion, scope) {
    const pct = criterionScore(criterion, scope);
    if (pct >= 100) return { label: 'Terpenuhi', tone: 'green' };
    if (pct >= 60) return { label: 'Dalam Proses', tone: 'amber' };
    if (pct > 0) return { label: 'Belum Terpenuhi', tone: 'red' };
    return { label: 'Belum Diisi', tone: 'gray' };
  }

  function groupScore(groupId, scope, raw) {
    const list = proper.byGroup(groupId);
    let total = 0;
    let verified = 0;
    list.forEach(c => {
      const s = indicatorStats(c, scope, raw);
      total += s.total;
      verified += s.verified;
    });
    return total ? Math.round((verified / total) * 100) : 0;
  }

  function historyIndex(period) {
    return data.HISTORY_PERIODS.indexOf(period);
  }

  function previousValue(groupId, scope) {
    const idx = historyIndex(scope.period);
    if (idx <= 0) return null;
    const period = data.HISTORY_PERIODS[idx - 1];
    return groupScore(groupId, { period, facility: scope.facility }, true);
  }

  function historySeries(scope) {
    const labels = data.HISTORY_PERIODS.slice();
    const at = period => ({ period, facility: scope.facility });
    return {
      labels,
      compliance: labels.map(p => groupScore('compliance', at(p), true)),
      beyond: labels.map(p => groupScore('beyond', at(p), true)),
      evidence: labels.map(p => {
        const stats = data.evidenceStats(data.evidenceForScope(at(p)));
        return stats.total ? Math.round(((stats.verified || 0) / stats.total) * 100) : 0;
      })
    };
  }

  function groupSummary(groupId, scope) {
    const group = proper.groups[groupId];
    const list = proper.byGroup(groupId);
    const score = groupScore(groupId, scope);
    const prev = previousValue(groupId, scope);
    let complete = 0;
    let partial = 0;
    let empty = 0;
    let atTarget = 0;
    list.forEach(c => {
      const pct = criterionScore(c, scope);
      if (pct >= 100) complete += 1;
      else if (pct > 0) partial += 1;
      else empty += 1;
      if (pct >= group.target) atTarget += 1;
    });
    return {
      id: groupId,
      title: group.title,
      subtitle: group.subtitle,
      icon: group.icon,
      description: group.description,
      target: group.target,
      score,
      prev,
      delta: prev == null ? null : score - prev,
      totalCriteria: list.length,
      complete,
      atTarget,
      partial,
      empty,
      gapToTarget: Math.max(0, group.target - score)
    };
  }

  function criteriaRows(groupId, scope) {
    return proper.byGroup(groupId).map(c => ({
      criterion: c,
      score: criterionScore(c, scope),
      status: criterionStatus(c, scope),
      stats: indicatorStats(c, scope)
    }));
  }

  function overallScore(scope) {
    const a = groupScore('compliance', scope);
    const b = groupScore('beyond', scope);
    return Math.round((a + b) / 2);
  }

  function evidenceReadiness(scope) {
    const list = data.evidenceForScope(scope);
    const stats = data.evidenceStats(list);
    const verified = stats.verified || 0;
    const pct = stats.total ? Math.round((verified / stats.total) * 100) : 0;
    return { list, stats, verified, pct };
  }

  function gaps(criterion, scope) {
    return criterion.indicators
      .filter(ind => effectiveStatus(ind, scope) !== 'verified')
      .map(ind => ({
        indicator: ind,
        status: effectiveStatus(ind, scope),
        label: (proper.statusMeta[effectiveStatus(ind, scope)] || proper.statusMeta.empty).label
      }));
  }

  function properSnapshot(scope) {
    const compliance = groupSummary('compliance', scope);
    const beyond = groupSummary('beyond', scope);
    const evidence = evidenceReadiness(scope);
    return {
      scope,
      rank: data.rankFor(scope.facility, scope.period),
      rankTone: data.rankTone(data.rankFor(scope.facility, scope.period)),
      rankDesc: data.rankDesc(data.rankFor(scope.facility, scope.period)),
      period: scope.period,
      facility: data.facilityName(scope.facility),
      compliance,
      beyond,
      overall: overallScore(scope),
      evidence
    };
  }

  P.readiness = {
    isDefaultScope,
    thresholdFor,
    effectiveStatus,
    indicatorStats,
    criterionScore,
    criterionStatus,
    criteriaRows,
    groupScore,
    groupSummary,
    overallScore,
    historySeries,
    evidenceReadiness,
    gaps,
    properSnapshot
  };
})(window);
