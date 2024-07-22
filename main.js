let res

let apiSrv = window.location.pathname
let password_value = document.querySelector("#passwordText").value
// let apiSrv = "https://journal.crazypeace.workers.dev"
// let password_value = "journaljournal"

// 这是默认行为, 在不同的index.html中可以设置为不同的行为
// This is default, you can define it to different funciton in different theme index.html
let buildValueItemFunc = buildValueTxt

function shorturl() {
    if (document.querySelector("#longURL").value == "") {
        alert("Url cannot be empty!");
        return;
    }

    // 短链中不能有空格
    // key can't have space in it
    document.getElementById('keyPhrase').value = document.getElementById('keyPhrase').value.replace(/\s/g, "-");

    document.getElementById("addBtn").disabled = true;
    document.getElementById("addBtn").innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Please wait...';
    fetch(apiSrv, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            cmd: "add",
            url: document.querySelector("#longURL").value,
            key: document.querySelector("#keyPhrase").value,
            password: password_value
        })
    }).then(function (response) {
        return response.json();
    }).then(function (myJson) {
        res = myJson;
        document.getElementById("addBtn").disabled = false;
        document.getElementById("addBtn").innerHTML = 'Shorten it';

        // 成功生成短链 Succeed
        if (res.status == "200") {
            let keyPhrase = res.key;
            let valueLongURL = document.querySelector("#longURL").value;
            // save to localStorage
            localStorage.setItem(keyPhrase, valueLongURL);
            // add to urlList on the page
            addUrlToList(keyPhrase, valueLongURL);

            let shortenedUrl = window.location.protocol + "//" + window.location.host + "/" + res.key;
            document.getElementById("shortenedUrl").innerText = shortenedUrl;

            var modal = new bootstrap.Modal(document.getElementById('exampleModal'));
            modal.show();
        } else {
            document.getElementById("result").innerHTML = res.error;
            var modal = new bootstrap.Modal(document.getElementById('resultModal'));
            modal.show();
        }

    }).catch(function (err) {
        alert("Unknown error. Please retry!");
        console.log(err);
        document.getElementById("addBtn").disabled = false;
        document.getElementById("addBtn").innerHTML = 'Shorten it';
    });
}

document.querySelector('#exampleModal .btn-success').addEventListener('click', function() {
    let shortenedUrl = document.getElementById("shortenedUrl").innerText;
    navigator.clipboard.writeText(shortenedUrl).then(function() {
        alert('链接已复制到剪贴板!');
    }, function(err) {
        console.error('Could not copy text: ', err);
    });
});


function copyurl(id, attr) {
    let target = null;

    if (attr) {
        target = document.createElement('div');
        target.id = 'tempTarget';
        target.style.opacity = '0';
        if (id) {
            let curNode = document.querySelector('#' + id);
            target.innerText = curNode[attr];
        } else {
            target.innerText = attr;
        }
        document.body.appendChild(target);
    } else {
        target = document.querySelector('#' + id);
    }

    try {
        let range = document.createRange();
        range.selectNode(target);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand('copy');
        window.getSelection().removeAllRanges();
        // console.log('Copy success')
    } catch (e) {
        console.log('Copy error')
    }

    if (attr) {
        // remove temp target
        target.parentElement.removeChild(target);
    }
}

function loadUrlList() {
    // 清空列表
    let urlList = document.querySelector("#urlList")
    while (urlList.firstChild) {
        urlList.removeChild(urlList.firstChild)
    }

    // 文本框中的长链接
    let longUrl = document.querySelector("#longURL").value
    // console.log(longUrl)

    // 遍历localStorage
    let len = localStorage.length
    // console.log(+len)
    for (; len > 0; len--) {
        let keyShortURL = localStorage.key(len - 1)
        let valueLongURL = localStorage.getItem(keyShortURL)

        // 如果长链接为空，加载所有的localStorage
        // If the long url textbox is empty, load all in localStorage
        // 如果长链接不为空，加载匹配的localStorage
        // If the long url textbox is not empty, only load matched item in localStorage
        if (longUrl == "" || (longUrl == valueLongURL)) {
            addUrlToList(keyShortURL, valueLongURL)
        }
    }
}

function addUrlToList(shortUrl, longUrl) {
    let urlList = document.querySelector("#urlList");

    let child = document.createElement('div');
    child.classList.add("mb-3", "list-group-item");

    let row = document.createElement('div');
    row.classList.add("row", "align-items-center");

    // 短链接信息 Short url
    let shortUrlCol = document.createElement('div');
    shortUrlCol.classList.add("col-lg-5", "col-md-12", "mb-2", "mb-lg-0");
    let keyTxt = document.createElement('span');
    keyTxt.classList.add("form-control");
    keyTxt.innerText = window.location.protocol + "//" + window.location.host + "/" + shortUrl;
    shortUrlCol.appendChild(keyTxt);
    row.appendChild(shortUrlCol);

    // 长链接信息 Long url
    let longUrlCol = document.createElement('div');
    longUrlCol.classList.add("col-lg-5", "col-md-12", "mb-2", "mb-lg-0");
    let longUrlTxt = document.createElement('span');
    longUrlTxt.classList.add("form-control");
    longUrlTxt.innerText = longUrl;
    longUrlCol.appendChild(longUrlTxt);
    row.appendChild(longUrlCol);

    // 按钮容器 Button container
    let btnCol = document.createElement('div');
    btnCol.classList.add("col-lg-2", "col-md-12", "d-flex", "justify-content-end", "align-items-center");

    // 删除按钮 Remove item button
    let delBtn = document.createElement('button');
    delBtn.setAttribute('type', 'button');
    delBtn.classList.add("btn", "btn-danger", "btn-icon", "me-2");
    delBtn.setAttribute('onclick', 'showConfirmDeleteModal(\"' + shortUrl + '\")');
    delBtn.setAttribute('id', 'delBtn-' + shortUrl);

    // 添加 SVG 图标
    delBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-trash">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M4 7l16 0"></path>
        <path d="M10 11l0 6"></path>
        <path d="M14 11l0 6"></path>
        <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path>
        <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path>
    </svg>
  `;
    btnCol.appendChild(delBtn);

    // 查询访问次数按钮 Query visit times button
    let qryCntBtn = document.createElement('button');
    qryCntBtn.setAttribute('type', 'button');
    qryCntBtn.classList.add("btn", "btn-info", "btn-icon", "me-2");
    qryCntBtn.setAttribute('onclick', 'queryVisitCount(\"' + shortUrl + '\")');
    qryCntBtn.setAttribute('id', 'qryCntBtn-' + shortUrl);

    // 添加 SVG 图标
    qryCntBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-info-circle">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"></path>
        <path d="M12 9h.01"></path><path d="M11 12h1v4h1"></path>
    </svg>
  `;
    btnCol.appendChild(qryCntBtn);

    // 显示二维码按钮 Show QR code button
    let qrcodeBtn = document.createElement('button');
    qrcodeBtn.setAttribute('type', 'button');
    qrcodeBtn.classList.add("btn", "btn-primary", "btn-icon");
    qrcodeBtn.setAttribute('onclick', 'buildQrcode(\"' + shortUrl + '\")');
    qrcodeBtn.setAttribute('id', 'qrcodeBtn-' + shortUrl);

    // 添加 SVG 图标
    qrcodeBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-qrcode">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M4 4m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" />
        <path d="M7 17l0 .01" />
        <path d="M14 4m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" />
        <path d="M7 7l0 .01" />
        <path d="M4 14m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" />
        <path d="M17 7l0 .01" />
        <path d="M14 14l3 0" />
        <path d="M20 14l0 .01" />
        <path d="M14 14l0 3" />
        <path d="M14 20l3 0" />
        <path d="M17 17l3 0" />
        <path d="M20 17l0 3" />
    </svg>
  `;
    btnCol.appendChild(qrcodeBtn);

    row.appendChild(btnCol);
    child.appendChild(row);

    urlList.append(child);
}



function clearLocalStorage() {
    localStorage.clear()
}

let deleteKeyPhrase = ""; // 用于存储当前要删除的键

function showConfirmDeleteModal(keyPhrase) {
  deleteKeyPhrase = keyPhrase;
  var modal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
  modal.show();
}

document.getElementById('confirmDeleteBtn').addEventListener('click', function() {
  deleteShortUrl(deleteKeyPhrase);
});

function deleteShortUrl(delKeyPhrase) {
    // 按钮状态 Button Status
    document.getElementById("delBtn-" + delKeyPhrase).disabled = true;
    document.getElementById("delBtn-" + delKeyPhrase).innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span>';

    // 从KV中删除 Remove item from KV
    fetch(apiSrv, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({cmd: "del", key: delKeyPhrase, password: password_value})
    }).then(function (response) {
        return response.json();
    }).then(function (myJson) {
        res = myJson;

        // 成功删除 Succeed
        if (res.status == "200") {
            // 从localStorage中删除
            localStorage.removeItem(delKeyPhrase)

            // 加载localStorage
            loadUrlList()

            document.getElementById("result").innerHTML = "Delete Successful"
        } else {
            document.getElementById("result").innerHTML = res.error;
        }

        // 弹出消息窗口 Popup the result
        var modal = new bootstrap.Modal(document.getElementById('resultModal'));
        modal.show();

    }).catch(function (err) {
        alert("Unknow error. Please retry!");
        console.log(err);
    })
}



// 生成模态框中的二维码
function buildQrcodeModal(shortUrl) {
    var options = {
        render: 'canvas',
        minVersion: 1,
        maxVersion: 40,
        ecLevel: 'Q',
        left: 0,
        top: 0,
        size: 256,
        fill: '#000',
        background: null,
        text: shortUrl,
        radius: 0,
        quiet: 0,
        mode: 0,
        mSize: 0.1,
        mPosX: 0.5,
        mPosY: 0.5,
        label: 'no label',
        fontname: 'sans',
        fontcolor: '#000',
        image: null
    };

    // 清空并生成新的二维码
    $("#qrcodeContainerModal").empty().qrcode(options);
}

function queryVisitCount(qryKeyPhrase) {
    // 按钮状态 Button Status
    document.getElementById("qryCntBtn-" + qryKeyPhrase).disabled = true;
    document.getElementById("qryCntBtn-" + qryKeyPhrase).innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span>';

    // 从KV中查询 Query from KV
    fetch(apiSrv, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({cmd: "qry", key: qryKeyPhrase + "-count", password: password_value})
    }).then(function (response) {
        return response.json();
    }).then(function (myJson) {
        let modal;
        res = myJson;

        // 成功查询 Succeed
        if (res.status == "200") {
            // 查询成功后，从localStorage获取原始链接
            let longUrl = localStorage.getItem(qryKeyPhrase);
            let shortUrl = window.location.protocol + "//" + window.location.host + "/" + qryKeyPhrase;

            // 显示模态框，并更新模态框中的内容
            document.getElementById("shortUrl").innerText = shortUrl;
            document.getElementById("longUrl").innerText = longUrl ? longUrl : "原始链接未找到";
            document.getElementById("visitCount").innerText = res.url;
            buildQrcodeModal(shortUrl);

            modal = new bootstrap.Modal(document.getElementById('visitCountModal'));
            modal.show();
        } else {
            handleQueryError(qryKeyPhrase);
        }

        // 恢复按钮状态
        document.getElementById("qryCntBtn-" + qryKeyPhrase).disabled = false;
        document.getElementById("qryCntBtn-" + qryKeyPhrase).innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-info-circle"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M12 9h.01" /><path d="M11 12h1v4h1" /></svg>';
    }).catch(function (err) {
        console.log("Error:", err);
        handleQueryError(qryKeyPhrase);
    });
}

function handleQueryError(qryKeyPhrase) {
    // 查询失败处理，将访问次数设置为0
    let longUrl = localStorage.getItem(qryKeyPhrase);
    let shortUrl = window.location.protocol + "//" + window.location.host + "/" + qryKeyPhrase;

    // 显示模态框，并更新模态框中的内容
    document.getElementById("shortUrl").innerText = shortUrl;
    document.getElementById("longUrl").innerText = longUrl ? longUrl : "原始链接未找到";
    document.getElementById("visitCount").innerText = "0";
    buildQrcodeModal(shortUrl);

    let modal = new bootstrap.Modal(document.getElementById('visitCountModal'));
    modal.show();
}


function query1KV() {
    let qryKeyPhrase = document.getElementById("keyForQuery").value;
    if (qryKeyPhrase == "") {
        return
    }

    // 从KV中查询 Query from KV
    fetch(apiSrv, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({cmd: "qry", key: qryKeyPhrase, password: password_value})
    }).then(function (response) {
        return response.json();
    }).then(function (myJson) {
        res = myJson;

        // 成功查询 Succeed
        if (res.status == "200") {
            document.getElementById("longURL").value = res.url;
            document.getElementById("keyPhrase").value = qryKeyPhrase;
            // 触发input事件
            document.getElementById("longURL").dispatchEvent(new Event('input', {
                bubbles: true,
                cancelable: true,
            }))
        } else {
            document.getElementById("result").innerHTML = res.error;
            // 弹出消息窗口 Popup the result
            var modal = new bootstrap.Modal(document.getElementById('resultModal'));
            modal.show();
        }

    }).catch(function (err) {
        alert("Unknow error. Please retry!");
        console.log(err);
    })
}

function loadKV() {
    //清空本地存储
    clearLocalStorage();

    // 从KV中查询, cmd为 "qryall", 查询全部
    fetch(apiSrv, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({cmd: "qryall", password: password_value})
    }).then(function (response) {
        return response.json();
    }).then(function (myJson) {
        res = myJson;
        // 成功查询 Succeed
        if (res.status == "200") {

            // 遍历kvlist
            res.kvlist.forEach(item => {
                keyPhrase = item.key;
                valueLongURL = item.value;
                // save to localStorage
                localStorage.setItem(keyPhrase, valueLongURL);
            });

        } else {
            document.getElementById("result").innerHTML = res.error;
            // 弹出消息窗口 Popup the result
            var modal = new bootstrap.Modal(document.getElementById('resultModal'));
            modal.show();
        }
    }).catch(function (err) {
        alert("Unknow error. Please retry!");
        console.log(err);
    })
}

// 生成二维码
function buildQrcode(shortUrl) {
    // 感谢项目 https://github.com/lrsjng/jquery-qrcode
    var options = {
        // render method: 'canvas', 'image' or 'div'
        render: 'canvas',

        // version range somewhere in 1 .. 40
        minVersion: 1,
        maxVersion: 40,

        // error correction level: 'L', 'M', 'Q' or 'H'
        ecLevel: 'Q',

        // offset in pixel if drawn onto existing canvas
        left: 0,
        top: 0,

        // size in pixel
        size: 256,

        // code color or image element
        fill: '#000',

        // background color or image element, null for transparent background
        background: null,

        // content
        // 要转换的文本
        text: window.location.protocol + "//" + window.location.host + "/" + shortUrl,

        // corner radius relative to module width: 0.0 .. 0.5
        radius: 0,

        // quiet zone in modules
        quiet: 0,

        // modes
        // 0: normal
        // 1: label strip
        // 2: label box
        // 3: image strip
        // 4: image box
        mode: 0,

        mSize: 0.1,
        mPosX: 0.5,
        mPosY: 0.5,

        label: 'no label',
        fontname: 'sans',
        fontcolor: '#000',

        image: null
    };
    // 生成二维码
    $("#qrcodeContainer").empty().qrcode(options);

    // 显示模态框
    const modal = new bootstrap.Modal(document.getElementById('qrCodeModal'));
    modal.show();

    // $("#qrcode-" + shortUrl.replace(/(:|\.|\[|\]|,|=|@)/g, "\\$1").replace(/(:|\#|\[|\]|,|=|@)/g, "\\$1")).empty().qrcode(options);
}

function buildValueTxt(longUrl) {
    let valueTxt = document.createElement('div')
    valueTxt.classList.add("form-control", "rounded-top-0")
    valueTxt.innerText = longUrl
    return valueTxt
}

document.addEventListener('DOMContentLoaded', function () {
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl)
    });

    loadUrlList();
});
