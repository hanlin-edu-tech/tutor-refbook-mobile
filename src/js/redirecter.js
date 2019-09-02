(function() {
    let url = window.location.search + window.location.hash;
    console.log(url);
    console.log(window.location.search);
    console.log(window.location.hash);
    let selfUrl = "?year=108&type=%E5%9C%8B%E4%B8%AD%E8%87%AA%E4%BF%AE%E4%B8%80%E4%B8%8A&";
    let teachUrl = "?year=108&type=%E6%95%99%E5%AD%B8%E5%BC%8F%E8%AC%9B%E7%BE%A9%E4%B8%80%E4%B8%8A&";
    let superUrl = "?year=108&type=%E8%B6%85%E7%B4%9A%E7%BF%B0%E5%B0%87%E4%B8%80%E4%B8%8A&";
    let baoUrl = "?year=108&type=%E8%A9%A6%E9%A1%8C%E5%AF%B6%E5%85%B8%E4%B8%80%E4%B8%8A&";
    let selfObj = {
        selfna1_2: `${selfUrl}subject=na#1_2`,
        selfna1_3: `${selfUrl}subject=na#1_3`,
        selfna1_4: `${selfUrl}subject=na#1_4`,
        selfna1_5: `${selfUrl}subject=na#1_5`,
        selfna1_6: `${selfUrl}subject=na#1_6`,
        selfna1_7: `${selfUrl}subject=na#1_7`,
        selfna1_8: `${selfUrl}subject=na#1_8`,
        selfna1_9: `${selfUrl}subject=na#1_9`
    };
    let teachObj = {
        teachna1_2: `${teachUrl}subject=na#1_2`,
        teachna1_3: `${teachUrl}subject=na#1_3`,
        teachna1_4: `${teachUrl}subject=na#1_4`,
        teachna1_5: `${teachUrl}subject=na#1_5`,
        teachna1_6: `${teachUrl}subject=na#1_6`,
        teachna1_7: `${teachUrl}subject=na#1_7`,
        teachna1_8: `${teachUrl}subject=na#1_8`,
        teachna1_9: `${teachUrl}subject=na#1_9`
    };
    let superObj = {
        superna1_2: `${superUrl}subject=na#1_2`,
        superna1_3: `${superUrl}subject=na#1_3`,
        superna1_4: `${superUrl}subject=na#1_4`,
        superna1_5: `${superUrl}subject=na#1_5`,
        superna1_6: `${superUrl}subject=na#1_6`,
        superna1_7: `${superUrl}subject=na#1_7`,
        superna1_8: `${superUrl}subject=na#1_8`,
        superna1_9: `${superUrl}subject=na#1_9`
    };
    let baoObj = {
        baona1_2: `${baoUrl}subject=na#1_2`,
        baona1_3: `${baoUrl}subject=na#1_3`,
        baona1_4: `${baoUrl}subject=na#1_4`,
        baona1_5: `${baoUrl}subject=na#1_5`,
        baona1_6: `${baoUrl}subject=na#1_6`,
        baona1_7: `${baoUrl}subject=na#1_7`,
        baona1_8: `${baoUrl}subject=na#1_8`,
        baona1_9: `${baoUrl}subject=na#1_9`
    };

    // 國中自修一上
    switch (url) {
        case selfObj.selfna1_2:
            window.location.href = `https://www.ehanlin.com.tw/event/collection/${selfUrl}subject=na#2_1`;
            break;
        case selfObj.selfna1_3:
            window.location.href = `https://www.ehanlin.com.tw/event/collection/${selfUrl}subject=na#3_1`;
            break;
        case selfObj.selfna1_4:
            window.location.href = `https://www.ehanlin.com.tw/event/collection/${selfUrl}subject=na#4_1`;
            break;
        case selfObj.selfna1_5:
            window.location.href = `https://www.ehanlin.com.tw/event/collection/${selfUrl}subject=na#5_1`;
            break;
        case selfObj.selfna1_6:
            window.location.href = `https://www.ehanlin.com.tw/event/collection/${selfUrl}subject=na#6_1`;
            break;
        case selfObj.selfna1_7:
            window.location.href = `https://www.ehanlin.com.tw/event/collection/${selfUrl}subject=na#7_1`;
            break;
        case selfObj.selfna1_8:
            window.location.href = `https://www.ehanlin.com.tw/event/collection/${selfUrl}subject=na#8_1`;
            break;
        case selfObj.selfna1_9:
            window.location.href = `https://www.ehanlin.com.tw/event/collection/${selfUrl}subject=na#9_1`;
            break;
        default:
            break;
    }

    // 教學式講義一上
    switch (url) {
        case teachObj.teachna1_2:
            window.location.href = `https://www.ehanlin.com.tw/event/collection/${teachUrl}subject=na#2_1`;
            break;
        case teachObj.teachna1_3:
            window.location.href = `https://www.ehanlin.com.tw/event/collection/${teachUrl}subject=na#3_1`;
            break;
        case teachObj.teachna1_4:
            window.location.href = `https://www.ehanlin.com.tw/event/collection/${teachUrl}subject=na#4_1`;
            break;
        case teachObj.teachna1_5:
            window.location.href = `https://www.ehanlin.com.tw/event/collection/${teachUrl}subject=na#5_1`;
            break;
        case teachObj.teachna1_6:
            window.location.href = `https://www.ehanlin.com.tw/event/collection/${teachUrl}subject=na#6_1`;
            break;
        case teachObj.teachna1_7:
            window.location.href = `https://www.ehanlin.com.tw/event/collection/${teachUrl}subject=na#7_1`;
            break;
        case teachObj.teachna1_8:
            window.location.href = `https://www.ehanlin.com.tw/event/collection/${teachUrl}subject=na#8_1`;
            break;
        case teachObj.teachna1_9:
            window.location.href = `https://www.ehanlin.com.tw/event/collection/${teachUrl}subject=na#9_1`;
            break;
        default:
            break;
    }

    // 超級翰將一上
    switch (url) {
        case superObj.superna1_2:
            window.location.href = `https://www.ehanlin.com.tw/event/collection/${superUrl}subject=na#2_1`;
            break;
        case superObj.superna1_3:
            window.location.href = `https://www.ehanlin.com.tw/event/collection/${superUrl}subject=na#3_1`;
            break;
        case superObj.superna1_4:
            window.location.href = `https://www.ehanlin.com.tw/event/collection/${superUrl}subject=na#4_1`;
            break;
        case superObj.superna1_5:
            window.location.href = `https://www.ehanlin.com.tw/event/collection/${superUrl}subject=na#5_1`;
            break;
        case superObj.superna1_6:
            window.location.href = `https://www.ehanlin.com.tw/event/collection/${superUrl}subject=na#6_1`;
            break;
        case superObj.superna1_7:
            window.location.href = `https://www.ehanlin.com.tw/event/collection/${superUrl}subject=na#7_1`;
            break;
        case superObj.superna1_8:
            window.location.href = `https://www.ehanlin.com.tw/event/collection/${superUrl}subject=na#8_1`;
            break;
        case superObj.superna1_9:
            window.location.href = `https://www.ehanlin.com.tw/event/collection/${superUrl}subject=na#9_1`;
            break;
        default:
            break;
    }

    // 試題寶典一上
    switch (url) {
        case baoObj.baona1_2:
            window.location.href = `https://www.ehanlin.com.tw/event/collection/${baoUrl}subject=na#2_1`;
            break;
        case baoObj.baona1_3:
            window.location.href = `https://www.ehanlin.com.tw/event/collection/${baoUrl}subject=na#3_1`;
            break;
        case baoObj.baona1_4:
            window.location.href = `https://www.ehanlin.com.tw/event/collection/${baoUrl}subject=na#4_1`;
            break;
        case baoObj.baona1_5:
            window.location.href = `https://www.ehanlin.com.tw/event/collection/${baoUrl}subject=na#5_1`;
            break;
        case baoObj.baona1_6:
            window.location.href = `https://www.ehanlin.com.tw/event/collection/${baoUrl}subject=na#6_1`;
            break;
        case baoObj.baona1_7:
            window.location.href = `https://www.ehanlin.com.tw/event/collection/${baoUrl}subject=na#7_1`;
            break;
        case baoObj.baona1_8:
            window.location.href = `https://www.ehanlin.com.tw/event/collection/${baoUrl}subject=na#8_1`;
            break;
        case baoObj.baona1_9:
            window.location.href = `https://www.ehanlin.com.tw/event/collection/${baoUrl}subject=na#9_1`;
            break;
        default:
            break;
    }
})();
