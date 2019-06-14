const moment = require('moment');

const onlyUnique = (value, index, self) => { 
    return self.indexOf(value) === index;
}

module.exports = {
    genPoporingChartUrl: dataList => {

        const priceArray = dataList.map(v => v.price);
        const y = priceArray.filter(p => p !=0).reverse().join(',');

        return 'https://image-charts.com/chart?' + [
            `cht=ls`,
            `chd=a:${y}`,
            `chds=a`,
            `chs=350x180`,
            `chco=76A4FB`,
        ].join('&');
    }
}