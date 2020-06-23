class Fittext {
    constructor(resizer_id) {
        this.resizer = document.getElementById(resizer_id)
    }
    _find_max_fontsizes(wh, card) {
        let innerHTML = card.get_html()
        let html = `<div style="width:${wh}px; height:${wh}px">\n${innerHTML}\n</div>`
        this.resizer.innerHTML = html
        let elements = this.resizer.getElementsByClassName("resizable")
        let fontSizes = new Array(elements.length)
        for (let i=0; i<elements.length; i++) {
            let elem = elements[i]
            let style = window.getComputedStyle(elem)
            let fontSize = parseInt(style.fontSize, 10)
            while (Math.abs(elem.scrollWidth-elem.clientWidth)<=1 && Math.abs(elem.scrollHeight-elem.clientHeight)<=1) {
                fontSize += 1
                elem.style.fontSize = fontSize + 'px'
            }
            fontSizes[i] = fontSize
        }
        return fontSizes
    }
    add_font_size_to_html(wh, card) {
        var html = card.get_html()
        const max_fontsizes = this._find_max_fontsizes(wh, card)
        let matches = [...html.matchAll(/resizable/g)]
        for (let i=matches.length-1; i>=0; i--) {
            let m = matches[i]
            let s0 = html.slice(0, m.index)
            let s1 = html.slice(m.index)
            const scaled_fontsize = .80*max_fontsizes[i]
            s1 = s1.replace('style=\"', `style=\"font-size:${scaled_fontsize}px;`)
            html = s0 + s1
        }
        return html
    }
}
