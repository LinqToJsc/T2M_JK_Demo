    //ID:DIV的id
            //data  数据          
            //textclass   文本的class名称
            //dockerId（非隐藏不带）   适用于在隐藏的div容器下 且宽度不是固定值的情况 给予一个容器的ID 获取宽度

            //     data[i].taskName  名称
            //     data[i].category 1 || 2 判断是否是  一级节点 二级节点
//     data[i].state  1 || 2 || 3判断状态  未完成 进行中  已完成

//0未开始  1 未完成  2 进行中  3 已完成  4逾期完成
            getSubwayMapData = function(ID, data ,textclass,dockerId) {
                var data = data || [];
                var stra = "";//背景
                var stra1 = ""; //未完成
                var straOver = "";//完成
                var stra1Arr = []; // 未完成的集合
                var straStartArr = [];//开始的集合
                var straOverArr = [];//完成的集合
                var color = ['#9daac1','#089820','#3c8dbc'];
                var cellSize = 40; //格子大小
                var textclass = textclass|| "text";//文本样式
                var width = $('#' + ID).width() ;//宽度   
                if("undefined" != typeof dockerId){
                    $('#' + ID).width($('#'+dockerId).width()); 
                    width=$('#'+dockerId).width();
                    var position  =  'relative'
                }            
                var rowsSp = 4; //行的距离
                var len = parseInt((width - cellSize * 5) / cellSize / rowsSp); //一行几个
                var rows = data.length / len * 3 + 1; //行      
                var columns = len * rowsSp + rowsSp; //列
                var lineWidth = 8;//线条大小
                var radiusWidth = 2;//圆角的长度
                var height = rows*rowsSp*cellSize;
                for (var i = 0; i < data.length; i++) {   //stra 为基础线   starOver表示完成         
                    //未完成     这里有几个条件就返回几个数组   并且执行几次arrListUl方法  
                    if (data[i].state == 1) {
                        stra1Arr.push(i);
                    }
                    //进行中
                    if (data[i].state == 2) {
                        straStartArr.push(i);
                    }
                    //已完成
                    if (data[i].state == 3) {
                        straOverArr.push(i);
                    }
                    if ((i >= len && (parseInt(i / len)) % 2 != 0)) {//偶数行
                       //节点
                        if (data[i].category == 1) {  //判断条件需要替换  判断节点 在奇数和偶数行判断做同样的操作
                                if (data[i].state == 1) {  //判断条件需要替换   未开始
                                    stra += "<li data-color='noStart' data-marker=\"interchange\" data-coords=\"" + ((len - Number((i % len))) * rowsSp) + "," + (1 + 3 * parseInt(i / len)) + "\"><a  href=\"javascript: return false;\" title='" + data[i].taskName + "'>" +cutString(data[i].taskName,30)  + "</a></li> ";
                                } else if (data[i].state == 2) { //判断条件需要替换 进行中
                                    stra += "<li data-color='start' data-marker=\"interchange\" data-coords=\"" + ((len - Number((i % len))) * rowsSp) + "," + (1 + 3 * parseInt(i / len)) + "\"><a href=\"javascript: return false;\" title='" + data[i].taskName + "'>" +cutString(data[i].taskName,30)  + "</a></li> ";
                                } else {// 已完成
                                    stra += "<li data-color='over' data-marker=\"interchange\" data-coords=\"" + ((len - Number((i % len))) * rowsSp) + "," + (1 + 3 * parseInt(i / len)) + "\"><a href=\"javascript: return false;\" title='" + data[i].taskName + "'>" +cutString(data[i].taskName,30)  + "</a></li> ";
                                }
                            }else{ //二级节点
                                if (data[i].state == 1) {  //判断条件需要替换 未开始
                                    stra += "<li data-color='noStart' data-coords=\"" + ((len - Number((i % len))) * rowsSp) + "," + (1 + 3 * parseInt(i / len)) + "\"><a href=\"javascript: return false;\" title='" + data[i].taskName + "'>" +cutString(data[i].taskName,30)  + "</a></li> ";
                                } else if (data[i].state == 2) { //判断条件需要替换 进行中
                                    stra += "<li data-color='start' data-coords=\"" + ((len - Number((i % len))) * rowsSp) + "," + (1 + 3 * parseInt(i / len)) + "\"><a href=\"javascript: return false;\" title='" + data[i].taskName + "'>" +cutString(data[i].taskName,30)  + "</a></li> ";
                                } else { //判断条件需要替换  已完成
                                    stra += "<li data-color='over' data-coords=\"" + ((len - Number((i % len))) * rowsSp) + "," + (1 + 3 * parseInt(i / len)) + "\"><a href=\"javascript: return false;\" title='" + data[i].taskName + "'>" +cutString(data[i].taskName,30)  + "</a></li> ";
                                }
                            }
                            // stra+="<li data-coords=\""+ ((len-Number((i%len)))*rowsSp)+","+(1+3*parseInt(i/len))+"\">"+data[i].taskName+"</li> ";  
                        if (i % len == len - 1) { 
                            //画圆角
                            stra += "<li data-coords=\"" + ((len - Number((i % len))) * rowsSp - radiusWidth + 1) + "," + (1 + 3 * parseInt(i / len)) + "\">" + "</li> ";
                            stra += "<li data-dir=\"W\"  data-coords=\"" + ((len - Number((i % len))) * rowsSp - radiusWidth) + "," + (1 + 3 * parseInt(i / len) + 1) + "\">" + "</li> ";
                            stra += "<li data-coords=\"" + ((len - Number((i % len))) * rowsSp - radiusWidth) + "," + (1 + 3 * parseInt(i / len) + 2) + "\">" + "</li> ";
                            stra += "<li data-dir=\"S\" data-coords=\"" + ((len - Number((i % len))) * rowsSp - radiusWidth + 1) + "," + (1 + 3 * parseInt(i / len) + 3) + "\">" + "</li> ";
                        } 
    
                    } else if ((i >= len && ((parseInt(i / len)) % 2) == 0) || i < len) {//奇数行
                        //节点
                        if (data[i].category == 1) { //判断条件需要替换
                                if (data[i].state == 1) { //判断条件需要替换
                                    stra += "<li data-color='noStart' data-marker=\"interchange\"  data-coords=\"" + (Number((i % len) + 1) * rowsSp) + "," + (1 + 3 * parseInt(i / len)) + "\"><a href=\"javascript: return false;\" title='" + data[i].taskName + "'>" +cutString(data[i].taskName,30)  + "</a></li> ";
                                } else if (data[i].state == 2 ) { //判断条件需要替换
                                    stra += "<li data-color='start' data-marker=\"interchange\"  data-coords=\"" + (Number((i % len) + 1) * rowsSp) + "," + (1 + 3 * parseInt(i / len)) + "\"><a href=\"javascript: return false;\" title='" + data[i].taskName + "'>" +cutString(data[i].taskName,30)  + "</a></li> ";
                                } else { //判断条件需要替换
                                    stra += "<li data-color='over' data-marker=\"interchange\"  data-coords=\"" + (Number((i % len) + 1) * rowsSp) + "," + (1 + 3 * parseInt(i / len)) + "\"><a href=\"javascript: return false;\" title='" + data[i].taskName + "'>" +cutString(data[i].taskName,30)  + "</a></li> ";
                                }
                            }else { //非二级节点
                                if (data[i].state == 1) {
                                    stra += "<li data-color='noStart' data-coords=\"" + (Number((i % len) + 1) * rowsSp) + "," + (1 + 3 * parseInt(i / len)) + "\"><a href=\"javascript: return false;\" title='" + data[i].taskName + "'>" +cutString(data[i].taskName,30)  + "</a></li> ";
                                } else if (data[i].state == 2) {
                                    stra += "<li data-color='start' data-coords=\"" + (Number((i % len) + 1) * rowsSp) + "," + (1 + 3 * parseInt(i / len)) + "\"><a href=\"javascript: return false;\" title='" + data[i].taskName + "'>" +cutString(data[i].taskName,30)  + "</a></li> ";
                                } else {
                                    stra += "<li data-color='over' data-coords=\"" + (Number((i % len) + 1) * rowsSp) + "," + (1 + 3 * parseInt(i / len)) + "\"><a href=\"javascript: return false;\" title='" + data[i].taskName + "'>" +cutString(data[i].taskName,30)  + "</a></li> ";
                                }
                            }
                            // stra+="<li  data-coords=\""+(Number((i%len)+1)*rowsSp)+","+(1+3*parseInt(i/len))+"\">"+data[i].taskName+"</li> ";  
                            //画圆角
                        if ((i - (len - 1)) % len == 0) {
                            stra += "<li  data-coords=\"" + (Number((i % len) + 1) * rowsSp + 1) + "," + (1 + 3 * parseInt(i / len)) + "\">" + "</li> ";
                            stra += "<li data-dir=\"E\" data-coords=\"" + (Number((i % len) + 1) * rowsSp + 2) + "," + (1 + 3 * parseInt(i / len) + 1) + "\">" + "</li> ";
                            stra += "<li  data-coords=\"" + (Number((i % len) + 1) * rowsSp + 2) + "," + (1 + 3 * parseInt(i / len) + 2) + "\">" + "</li> ";
                            stra += "<li data-dir=\"S\" data-coords=\"" + (Number((i % len) + 1) * rowsSp + 1) + "," + (1 + 3 * parseInt(i / len) + 3) + "\">" + "</li> ";
                        } 
    
                    }
                }
                var arrListUl = function (ID, arr, color, len) {
                    var arrListUldata = find(arr);
                    if (arrListUldata != null && arrListUldata.length > 0) {//偶数行
                        for (var i = 0; i < arrListUldata.length; i++) {
                            var str = " <ul data-color=\"" + color + "\" >";
                            for (var j = 0; j < arrListUldata[i].length; j++) {
                                //循环取值  
                                if ((arrListUldata[i][j] >= len && (parseInt(arrListUldata[i][j] / len)) % 2 != 0)) {
                                       str += "<li  data-coords=\"" + ((len - Number((arrListUldata[i][j] % len))) * rowsSp) + "," + (1 + 3 * parseInt(arrListUldata[i][j] / len)) + "\">" + "</li> ";
                                        if (arrListUldata[i][j] % len == len - 1) {
                                          //画圆角
                                        str += "<li data-coords=\"" + ((len - Number((arrListUldata[i][j] % len))) * rowsSp - radiusWidth + 1) + "," + (1 + 3 * parseInt(arrListUldata[i][j] / len)) + "\">" + "</li> ";
                                        str += "<li data-dir=\"W\"  data-coords=\"" + ((len - Number((arrListUldata[i][j] % len))) * rowsSp - radiusWidth) + "," + (1 + 3 * parseInt(arrListUldata[i][j] / len) + 1) + "\">" + "</li> ";
                                        str += "<li data-coords=\"" + ((len - Number((arrListUldata[i][j] % len))) * rowsSp - radiusWidth) + "," + (1 + 3 * parseInt(arrListUldata[i][j] / len) + 2) + "\">" + "</li> ";
                                        str += "<li data-dir=\"S\" data-coords=\"" + ((len - Number((arrListUldata[i][j] % len))) * rowsSp - radiusWidth + 1) + "," + (1 + 3 * parseInt(arrListUldata[i][j] / len) + 3) + "\">" + "</li> ";
                                    } 
    
                                } else if ((arrListUldata[i][j] >= len && ((parseInt(arrListUldata[i][j] / len)) % 2) == 0) || arrListUldata[i][j] < len) {//奇数行
                                    str += "<li  data-coords=\"" + (Number((arrListUldata[i][j] % len) + 1) * rowsSp) + "," + (1 + 3 * parseInt(arrListUldata[i][j] / len)) + "\">" + "</li> ";                                
                                    if ((arrListUldata[i][j] - (len - 1)) % len == 0) {
                                       //画圆角
                                        str += "<li  data-coords=\"" + (Number((arrListUldata[i][j] % len) + 1) * rowsSp + 1) + "," + (1 + 3 * parseInt(arrListUldata[i][j] / len)) + "\">" + "</li> ";
                                        str += "<li data-dir=\"E\" data-coords=\"" + (Number((arrListUldata[i][j] % len) + 1) * rowsSp + 2) + "," + (1 + 3 * parseInt(arrListUldata[i][j] / len) + 1) + "\">" + "</li> ";
                                        str += "<li  data-coords=\"" + (Number((arrListUldata[i][j] % len) + 1) * rowsSp + 2) + "," + (1 + 3 * parseInt(arrListUldata[i][j] / len) + 2) + "\">" + "</li> ";
                                        str += "<li data-dir=\"S\" data-coords=\"" + (Number((arrListUldata[i][j] % len) + 1) * rowsSp + 1) + "," + (1 + 3 * parseInt(arrListUldata[i][j] / len) + 3) + "\">" + "</li> ";
                                    }
    
                                }
                            }
                            str += " </ul>";
                            $('#' + ID).append(str);
                            str = '';
                        }
                    }
                };
                stra = "<ul data-color=\""+color[0]+"\">"+stra+"</ul>";
                //背景
                $('#' + ID).append(stra);
                //未完成的
                arrListUl(ID, stra1Arr,color[0], len);
                //开始的
                arrListUl(ID, straStartArr, color[1], len);
                //已经完成的
                arrListUl(ID, straOverArr, color[2], len);
                //添加定位
                $('#' + ID).css('position',position);
               
                //替换自定义属性
                $('#' + ID).attr('data-columns', columns).attr('data-rows', rows).attr('data-cellSize', cellSize).attr('data-lineWidth', lineWidth).attr('data-textClass',textclass);       
                //初始化
                $('#' + ID).subwayMap({});
                // $('#' + ID).subwayMap({ debug: true });
                //居中
                $('#' + ID).width($('#' + ID).find('canvas').attr('width'));
                   //设置宽度
                  $('#' + ID).height($('#' + ID).find('canvas').attr('height'));
                //把文字居中
                if(position=="relative"){
                    $('.'+textclass).css('margin-left', ('-'+(width - $('#' + ID).find('canvas').attr('width')) / 2));
                }else{
                    $('.'+textclass).css('margin-left', ((width / $('#' + ID).find('canvas').attr('width')) / 2)+1);
                }
               
                //取连续相同的值
                function find(arr) {
                    var reArr = [];
                    var pre = arr[0];
                    var count = 1;
                    for (var i = 1; i < arr.length; i++) {
                        if (arr[i] == pre + 1) {
                            count++;
                            pre++;
                        } else {
                            if (count) {
                                reArr.push(arr.slice(i - count, i));
                            }
                            pre = arr[i];
                            first = i;
                            count = 1;
                        }
                    }
    
                    if (count) {
                        reArr.push(arr.slice(i - count, i));
                    }
                    return reArr;//[[1,2],[6,8,9]]
                }
                //处理文字
                function cutString(str, len) {
                    //length属性读出来的汉字长度为1
                    if (str.length * 2 <= len) {
                        return str;
                    }
                    var strlen = 0;
                    var s = "";
                    for (var i = 0; i < str.length; i++) {
                        s = s + str.charAt(i);
                        if (str.charCodeAt(i) > 128) {
                            strlen = strlen + 2;
                            if (strlen >= len) {
                                return s.substring(0, s.length - 1) + "...";
                            }
                        } else {
                            strlen = strlen + 1;
                            if (strlen >= len) {
                                return s.substring(0, s.length - 2) + "...";
                            }
                        }
                    }
                    return s;
                }
            }