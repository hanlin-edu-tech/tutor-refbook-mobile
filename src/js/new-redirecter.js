(function () {
    let url = location.href;
    console.log(decodeURIComponent(url))

    let queryDate = {
        year: decodeURIComponent(url).split("year=")[1].split("&")[0],
        type: decodeURIComponent(url).split("type=")[1].split("&")[0],
        subject: decodeURIComponent(url).split("subject=")[1].split("&")[0]
    }
    console.log(queryDate)

    let query = `year=${queryDate.year}&type=${queryDate.type}&subject=${queryDate.subject}`

    fetch(`https://www.ehanlin.com.tw/handoutresource/api/Find?${query}`, {
        method: 'GET',
        cache: 'no-cache',
        mode: 'cors'
    })
        .then(response => response.json())
        .catch(error => console.error('Error:', error))
        .then(response => {


            response.forEach(function (event, index) {
                event.resources.forEach(function (element, index) {

                    if (element.redirecter !== null && queryDate.subject == element.qRcode) {
                        console.log(element.qRcode + " 轉 " + element.redirecter)
                        window.location.href = decodeURIComponent(url).split(queryDate.subject)[0] + element.redirecter
                    }

                })
            })

        });
})();