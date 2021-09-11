function inject(str: string, obj: any): string {
    return str.replace(/\${(.*?)}/g, (x,g)=> obj[g]);
}

function formatDate(date: Date): string {
    
    return inject("${Y}-${m}-${d} ${H:i:s}", {
        'Y': date.getFullYear(),
        'm': pad(date.getMonth() + 1, 2),
        'd': pad(date.getDate(), 2),
        'H:i:s': date.toTimeString().split(" GMT")[0]
    });
}

function pad(num: string | number, size: number): string {
    if (typeof num === "number") {
        num = num.toString();
    }
    
    while (num.length < size) num = "0" + num;
    return num;
}

module.exports = {
    inject: inject,
    formatDate: formatDate
}