document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) return location.href = '../login/login.html';
  const headers = { 'Authorization': `Bearer ${token}` };

  // 1) Trend nuovi eventi
  const overRes = await fetch('/api/statistics/over-time', { headers });
  const overData = overRes.ok ? await overRes.json() : [];
  const days = Array.from({ length: 30 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return d.toISOString().slice(0,10);
  });
  const fullData = days.map(date => ({ date, count: (overData.find(x=>x.date===date)||{}).count||0 }));

  new Chart(
    document.getElementById('overTimeChart').getContext('2d'),
    {
      type: 'line',
      data: {
        labels: fullData.map(d => d.date),
        datasets: [{ label: 'Eventi creati', data: fullData.map(d => d.count), fill: false, tension: 0.3 }]
      },
      options: { scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }
    }
  );

  // 2) Top 5 eventi
  const topRes = await fetch('/api/statistics/top-events', { headers });
  if (topRes.ok) {
    const items = (await topRes.json()).map(e => `<li>${e.name}: <strong>${e.count}</strong> iscritti</li>`);
    document.getElementById('topEventsList').innerHTML = items.join('');
  }

  // 3) Fill rates
  const fillRes = await fetch('/api/statistics/fill-rates', { headers });
  if (fillRes.ok) {
    const items = (await fillRes.json()).map(f => `<li>${f.name}: ${f.registered}/${f.capacity} (${f.fillRate}%)</li>`);
    document.getElementById('fillRatesList').innerHTML = items.join('');
  }
});