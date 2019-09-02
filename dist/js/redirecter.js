(function() {
    let url = window.location.href;
    let selfUrl = "https://www.ehanlin.com.tw/event/collection/?year=108&type=%E5%9C%8B%E4%B8%AD%E8%87%AA%E4%BF%AE%E4%B8%80%E4%B8%8A&subject=";
    let teachUrl = "https://www.ehanlin.com.tw/event/collection/?year=108&type=%E6%95%99%E5%AD%B8%E5%BC%8F%E8%AC%9B%E7%BE%A9%E4%B8%80%E4%B8%8A&subject=";
    let superUrl = "https://www.ehanlin.com.tw/event/collection/?year=108&type=%E8%B6%85%E7%B4%9A%E7%BF%B0%E5%B0%87%E4%B8%80%E4%B8%8A&subject=";
    let baoUrl = "https://www.ehanlin.com.tw/event/collection/?year=108&type=%E8%A9%A6%E9%A1%8C%E5%AF%B6%E5%85%B8%E4%B8%80%E4%B8%8A&subject=";
    let selfObj = {
        selfna1_2: `${selfUrl}na#1_2`,
        selfna1_3: `${selfUrl}na#1_3`,
        selfna1_4: `${selfUrl}na#1_4`,
        selfna1_5: `${selfUrl}na#1_5`,
        selfna1_6: `${selfUrl}na#1_6`,
        selfna1_7: `${selfUrl}na#1_7`,
        selfna1_8: `${selfUrl}na#1_8`,
        selfna1_9: `${selfUrl}na#1_9`
    };
    let teachObj = {
        teachna1_2: `${teachUrl}na#1_2`,
        teachna1_3: `${teachUrl}na#1_3`,
        teachna1_4: `${teachUrl}na#1_4`,
        teachna1_5: `${teachUrl}na#1_5`,
        teachna1_6: `${teachUrl}na#1_6`,
        teachna1_7: `${teachUrl}na#1_7`,
        teachna1_8: `${teachUrl}na#1_8`,
        teachna1_9: `${teachUrl}na#1_9`
    };
    let superObj = {
        superna1_2: `${superUrl}na#1_2`,
        superna1_3: `${superUrl}na#1_3`,
        superna1_4: `${superUrl}na#1_4`,
        superna1_5: `${superUrl}na#1_5`,
        superna1_6: `${superUrl}na#1_6`,
        superna1_7: `${superUrl}na#1_7`,
        superna1_8: `${superUrl}na#1_8`,
        superna1_9: `${superUrl}na#1_9`
    };
    let baoObj = {
        baona1_2: `${baoUrl}na#1_2`,
        baona1_3: `${baoUrl}na#1_3`,
        baona1_4: `${baoUrl}na#1_4`,
        baona1_5: `${baoUrl}na#1_5`,
        baona1_6: `${baoUrl}na#1_6`,
        baona1_7: `${baoUrl}na#1_7`,
        baona1_8: `${baoUrl}na#1_8`,
        baona1_9: `${baoUrl}na#1_9`
    };

    // 國中自修一上
    switch (url) {
        case selfObj.selfna1_2:
            window.location.href = `${selfUrl}na#2_1`;
            break;
        case selfObj.selfna1_3:
            window.location.href = `${selfUrl}na#3_1`;
            break;
        case selfObj.selfna1_4:
            window.location.href = `${selfUrl}na#3_2`;
            break;
        case selfObj.selfna1_5:
            window.location.href = `${selfUrl}na#3_3`;
            break;
        case selfObj.selfna1_6:
            window.location.href = `${selfUrl}na#4_1`;
            break;
        case selfObj.selfna1_7:
            window.location.href = `${selfUrl}na#4_2`;
            break;
        case selfObj.selfna1_8:
            window.location.href = `${selfUrl}na#5_1`;
            break;
        case selfObj.selfna1_9:
            window.location.href = `${selfUrl}na#6_1`;
            break;
        default:
            break;
    }

    // 教學式講義一上
    switch (url) {
        case teachObj.teachna1_2:
            window.location.href = `${teachUrl}na#2_1`;
            break;
        case teachObj.teachna1_3:
            window.location.href = `${teachUrl}na#3_1`;
            break;
        case teachObj.teachna1_4:
            window.location.href = `${teachUrl}na#3_2`;
            break;
        case teachObj.teachna1_5:
            window.location.href = `${teachUrl}na#3_3`;
            break;
        case teachObj.teachna1_6:
            window.location.href = `${teachUrl}na#4_1`;
            break;
        case teachObj.teachna1_7:
            window.location.href = `${teachUrl}na#4_2`;
            break;
        case teachObj.teachna1_8:
            window.location.href = `${teachUrl}na#5_1`;
            break;
        case teachObj.teachna1_9:
            window.location.href = `${teachUrl}na#6_1`;
            break;
        default:
            break;
    }

    // 超級翰將一上
    switch (url) {
        case superObj.superna1_2:
            window.location.href = `${superUrl}na#2_1`;
            break;
        case superObj.superna1_3:
            window.location.href = `${superUrl}na#3_1`;
            break;
        case superObj.superna1_4:
            window.location.href = `${superUrl}na#3_2`;
            break;
        case superObj.superna1_5:
            window.location.href = `${superUrl}na#3_3`;
            break;
        case superObj.superna1_6:
            window.location.href = `${superUrl}na#4_1`;
            break;
        case superObj.superna1_7:
            window.location.href = `${superUrl}na#4_2`;
            break;
        case superObj.superna1_8:
            window.location.href = `${superUrl}na#5_1`;
            break;
        case superObj.superna1_9:
            window.location.href = `${superUrl}na#6_1`;
            break;
        default:
            break;
    }

    // 試題寶典一上
    switch (url) {
        case baoObj.baona1_2:
            window.location.href = `${baoUrl}na#2_1`;
            break;
        case baoObj.baona1_3:
            window.location.href = `${baoUrl}na#3_1`;
            break;
        case baoObj.baona1_4:
            window.location.href = `${baoUrl}na#3_2`;
            break;
        case baoObj.baona1_5:
            window.location.href = `${baoUrl}na#3_3`;
            break;
        case baoObj.baona1_6:
            window.location.href = `${baoUrl}na#4_1`;
            break;
        case baoObj.baona1_7:
            window.location.href = `${baoUrl}na#4_2`;
            break;
        case baoObj.baona1_8:
            window.location.href = `${baoUrl}na#5_1`;
            break;
        case baoObj.baona1_9:
            window.location.href = `${baoUrl}na#6_1`;
            break;
        default:
            break;
    }
})();
