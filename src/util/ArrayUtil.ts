export default class ArrayUtil {
    static copy(arr) {
        var new_arr = arr.slice(0);
        for (var i = new_arr.length; i--;)
            if (new_arr[i] instanceof Array)
                new_arr[i] = this.copy(new_arr[i]);
        return new_arr;
    }
}