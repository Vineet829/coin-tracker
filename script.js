let table = document.querySelector(".table_body");
let link = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false";
let oldData = [];

async function fetchData() {
    try {
        const response = await fetch(link);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        oldData = data;
        renderData(data);
    } catch (error) {
        if (oldData.length > 0) {
            renderData(oldData);
        }
    }
}

function renderData(data) {
    table.innerHTML = '';
    data.forEach(item => {
        let priceChange = parseFloat(item.price_change_24h).toFixed(2);
        let symbolUpperCase = item.symbol.toUpperCase();
        let row = document.createElement('tr');

        row.innerHTML = `
            <td>
                <div class="coin-img">
                    <img src="${item.image}" alt="" style="width: 45px; height: 45px" />
                    <div class="coin-name">${item.name}</div>
                </div>
            </td>
            <td>${symbolUpperCase}</td>
            <td>${item.current_price}</td>
            <td>${item.total_volume}</td>
            <td class="percentage_change">${priceChange}%</td>
            <td>Mkr Cap: ${item.market_cap}</td>
        `;

        let percentageCell = row.querySelector('.percentage_change');
        percentageCell.style.color = priceChange < 0 ? 'red' : 'green';

        table.appendChild(row);
    });
}

function filterTable(searchTerm) {
    const filteredData = oldData.filter(item => {
        return item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
               item.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    });
    renderData(filteredData);
}

document.getElementById('search_bar').addEventListener('keyup', function(event) {
    const searchTerm = event.target.value;
    filterTable(searchTerm);
});

function sortByMarketCap() {
    let sortedData = [...oldData].sort((a, b) => b.market_cap - a.market_cap);
    renderData(sortedData);
}

function sortByPercentage() {
    let sortedData = [...oldData].sort((a, b) => b.price_change_24h - a.price_change_24h);
    renderData(sortedData);
}

fetchData();
