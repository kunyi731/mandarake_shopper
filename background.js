// Mandarake shopper plugin

/* Parse a specific URL HTTP request result */
function searchInUrlResult(searchUrl, searchPattern, excludeString, callback, errorCallBack) {
  var x = new XMLHttpRequest();
  x.onreadystatechange = function() { 
    if (x.readyState == 4 && x.status == 200)
        callback(x.responseText, searchPattern, excludeString);
  }
  x.open("GET", searchUrl, true); // true for asynchronous 
  x.send(null);
}

function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}


function urlSearchString(urlText, strPattern, excludeString) {
  if (urlText.search(strPattern) != -1) {
    console.log('Alert! Found string ' + strPattern + ' on Mandarake search page!');
    var resultHtml = document.createElement('html');
    resultHtml.innerHTML = urlText;
    arrayA = resultHtml.getElementsByTagName('a');
    if (arrayA === undefined) {
      console.log('Cannot find element by tag a');
      return;
    }

    alertText = '';
    var urlList = [];

    for (var i = 0; i < arrayA.length; i++) {
      if (arrayA[i].hasAttribute('href') && 
          arrayA[i].textContent.search(strPattern) != -1 &&
          arrayA[i].textContent.search(excludeString) == -1) {
      
        alertText += 'Alert! Found new item according to your search! \n Search pattern is ' +
                    strPattern + 
                    '\n Found item description is ' + arrayA[i].textContent +
                    ' link is https://order.mandarake.co.jp' + 
                    arrayA[i].getAttribute('href') + '\n';
        urlList.push('https://order.mandarake.co.jp' + arrayA[i].getAttribute('href') );
        //console.log(alertText);
      }
    }


    var opt = {
      type: "basic",
      title: "Get your wallet ready!",
      message: " It's Homura Time!!",
      iconUrl: "Homura.gif"
    };

    chrome.notifications.create(NotificationOptions=opt);
    chrome.notifications.onClicked.addListener(
          function () {
            for (var j = 0; j < urlList.length; j++) {
              //alert("Opening URL " + urlList[j]);
              chrome.tabs.create({url:urlList[j]});
            }
            clearInterval();
          }
        );
  } else {
    console.log("Didn't find anything! in result" + strPattern + urlText);
  }
}

function MandarakeSearch() {
  url = 'https://order.mandarake.co.jp/order/listPage/serchKeyWord?keyword=Ichiban+Kuji+%2FMagiccraft&target=0&dispCount=240&soldOut=0'
  searchString = 'Homura';
  excludeString = 'visualization';

  searchInUrlResult(url,
                    searchString,
                    excludeString,
                    urlSearchString, 
                    //Error callback
                    function(errorMessage) {
                      renderStatus('Error. ' + errorMessage);
                    });

}

setInterval(MandarakeSearch, 30000);
