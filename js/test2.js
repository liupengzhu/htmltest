/**
 * Created by admin on 2018/4/15.
 */

function strlen(str) {
    var len = 0;
    var i = 0;
    for (i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 255) {
            len += 2;
        }
        else {
            len++;
        }
    }
    return len;
}