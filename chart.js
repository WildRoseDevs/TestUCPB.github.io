document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/vote_data');
        const data = await response.json();
        // data = { "1": {"yay": <int>, "nay": <int>}, "2": {...}, ... }

        for (let qid in data) {
            const canvasId = 'chart' + qid;
            const canvas = document.getElementById(canvasId);
            if (!canvas) continue;

            const yayCount = data[qid].yay;
            const nayCount = data[qid].nay;

            new Chart(canvas, {
                type: 'pie',
                data: {
                    labels: ['YAY', 'NAY'],
                    datasets: [{
                        data: [yayCount, nayCount],
                        backgroundColor: ['#4CAF50', '#F44336']
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: `Question ${qid} Votes`
                        }
                    }
                }
            });
        }
    } catch (err) {
        console.error('Error loading vote data:', err);
    }
});
