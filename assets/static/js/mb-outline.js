class Card {
    constructor(level) {
        this.content = new CardPart()
        this.level = level
        this.mnemonic = new CardPart()
    }
    add_content_part(type, content) {
        this.content.add(type, content)
    }
    add_mnemonic_part(type, content) {
        this.mnemonic.add(type, content)
    }
    amend_content(new_card_part) {
        for (let k=0; k<new_card_part.parts.length; k++) {
            this.content.parts.push(new_card_part.parts[k])
        }
    }
    amend_mnemonic(new_card_part) {
        for (let k=0; k<new_card_part.parts.length; k++) {
            this.mnemonic.parts.push(new_card_part.parts[k])
        }
    }
    get_html() {
        let s = '<div class="container">\n'
        if (this.mnemonic.is_empty()) {
            const height = 100
            const header_html = this.content.get_header_html(height)            
            s += header_html
        } else { // if (this.mnemonic.is_empty()) {
            const height = 50
            const header_html = this.content.get_header_html(height)            
            s += header_html
            const footer_html = this.mnemonic.get_footer_html(height)            
            s += footer_html
        }
        s += '</div>\n'
        return s
    }
    delete_mnemonic() {
        this.mnemonic.delete()
    }
}

class CardPart {
    constructor() {
        this.parts = []
    }
    add(type, content) {
        if (content.content === "")
            return
        
        const sw0 = (type === 'title')
        const sw1 = (type === 'h1')
        const sw2 = (type === 'h2')
        const sw3 = (type === 'p')
        const sw4 = (type === 'img')
        const sw5 = (type === 'li')
        
        assert(sw0||sw1||sw2||sw3||sw4||sw5)

        this.parts.push({type: type, content: content})
    }
    get_header_html(height) {
        assert(height===50 || height===100)
        const count = this.count_image_and_text()
        assert(count.image!==0 || count.text !==0)
        const html_core = this.get_html_core()
        let s = ''
        if (count.image === 0 && count.text !==0) { // Text only
            let style = `flex-direction:column; width:100%; height:${height}%; border: 2px solid orange;`
            s += `<div class="resizable base_style" style="${style}">\n`
            s += html_core.txt
            s += '</div>\n'
        } else if (count.image !== 0 && count.text ===0) {
            // Image(s) only
            let style = `flex-direction:row; width:100%; height:${height}%`
            s += `<div class="base_style" style="${style}">\n`
            s += html_core.img
            s += '</div>\n'
        }
        else {
            // Mixed, text and image(s)
            const main_style = `flex-direction:row; width:100%; height:${height}%;`
            s += `<div class="base_style" style="${main_style}">\n`
            const style_left = `flex-direction:column; width:50%; height:100%;`
            s += `<div class="resizable base_style" style="${style_left}">\n`
            s += html_core.txt
            s += '</div>\n'
            const style_right = `flex-direction:row; width:50%; height:100%;`
            s += `<div class="base_style" style="${style_right}">\n`
            s += html_core.img
            s += '</div>\n'
            s += '</div>\n'
        }
        return s
    }

    get_footer_html(height) {
        assert(height===50 || height===100)
        const count = this.count_image_and_text()
        assert(count.image!==0 || count.text !==0)
        const html_core = this.get_html_core()
        let s = ''
        if (count.image === 0 && count.text !==0) { // Text only
            let style = `flex-direction:column; width:100%; height:${height}%; border: 2px solid orange;`
            s += `<div class="resizable base_style" style="${style}">\n`
            s += html_core.txt
            s += '</div>\n'
        } else if (count.image !== 0 && count.text ===0) {
            // Image(s) only
            let style = `flex-direction:row; width:100%; height:${height}%`
            s += `<div class="base_style" style="${style}">\n`
            s += html_core.img
            s += '</div>\n'
        }
        else {
            // Mixed, text and image(s)
            const main_style = `flex-direction:row; width:100%; height:${height}%;`
            s += `<div class="base_style" style="${main_style}">\n`
            const style_left = `flex-direction:row; width:50%; height:100%;`
            s += `<div class="base_style" style="${style_left}">\n`
            s += html_core.img
            s += '</div>\n'
            const style_right = `flex-direction:column; width:50%; height:100%;`
            s += `<div class="resizable base_style" style="${style_right}">\n`
            s += html_core.txt
            s += '</div>\n'
            s += '</div>\n'
        }
        return s
    }

    get_html_core() {
        let html_txt = ''
        let html_img = ''
        var fsm = new StateMachine({
            init: 'default',
            transitions: [
                { name: 'step', from: '*', to: x=>x.type },
                { name: 'end',  from: '*', to: 'default' }
            ],
            methods: {
                onEnterLi:   function() {html_txt+='<ul>\n'},
                onLeaveLi:   function() {html_txt+='</ul>\n'},
            }
        });
   
        for (let i=0; i<this.parts.length; i++) {
            const part = this.parts[i]
            if (part.content.type == 'img') {
                html_img += `<div class="image"><img src="${part.content.content}"/></div>\n`
                continue
            }
            fsm.step(part)
            // Action after state transition.
            assert(part.type === 'p' || part.type === 'li' || part.type === 'h1' || part.type === 'h2')
            switch (part.content.type) {
                case 'string':
                    html_txt += `<${fsm.state}>${part.content.content}</${fsm.state}>\n`
                    break
                case 'img':
                    html_txt += `<${fsm.state}><img src="${part.content.content}" alt="${part.content.content}"/></${fsm.state}>\n`
                    break
                case 'a':
                    if (part.content.desc)
                        html_txt += `<${fsm.state}><a href="${part.content.link}">${part.content.desc}</a></${fsm.state}>\n`
                    else {
                        html_txt += `<${fsm.state}><a href="${part.content.link}">${part.content.link}</a></${fsm.state}>\n`
                    }
                    break
                default:
                    throw "Implement!"
                    break
            }
        }
        fsm.end()  
          
        return {txt: html_txt, img: html_img}
    }
    
    get_html_from_item(item) {
        const sw = item.content.startsWith('file:')
        const content = sw ? `<img src=${item.content.slice(5,)} alt=${item.content}/>`
                        : item.content
        if (item.type == 'img' ) {
            return content
        } else {
            return `<${item.type}>${content}</${item.type}> `
        }
    }
    is_empty() {
        return this.parts.length == 0
    }
    count_image_and_text() {
        let count = {image: 0, text: 0}
        for (let i=0; i<this.parts.length; i++) {
            const card = this.parts[i]
            switch (card.content.type) {
                case 'string':
                    count.text++
                    break
                case 'a':
                    count.text++
                    break
                case 'img':
                    count.image++
                    break
                default:
                    throw "Unknown item: " + card.content.type
            }
        }
        return count
    }
    delete() {
        this.parts = []
    }
}

class Outline {
    static last_card = null
    constructor(outline_json=null) {
        this.cards = []
        this.outlines = []
        this.main_section_parser = null
        this.breadCrumb = new BreadCrumb(this.main_section_parser)
        if (outline_json != null)
            this.init(outline_json)
    }
    init(outline_json) {
        const N_nodes = outline_json.length
        let start = 0
        let title = 'undefined'
        if (outline_json[0].type == "section") {
            this.main_section_parser = new MainSectionParser(outline_json[0])
            const new_cards = this.main_section_parser.get_cards()
            if (new_cards.length > 0)
                this.append_new_cards(new_cards)
            start = 1
            title = this.main_section_parser.settings.title
        }
        const remaining_outline = outline_json.slice(start,)
        if (remaining_outline.length > 0) {
            // FIXME A class for parsing the body seems a bad design choice.
            new BodyParser(this, remaining_outline)
        }

        const level = 0
        this.init_guidance(this, null, title, level)
    }
    append_new_card(card, level=-1) {
        if (level < 0) {
            level = card.level
            this.last_level = level
        }
        if (level == 0) {
            this.append_new_cards([card])
        }
        else {
            this.outlines.slice(-1)[0].append_new_card(card, level-1)
        }
    }
    append_new_cards(new_cards) {
        for (let i=0; i<new_cards.length; i++) {
            this.cards.push(new_cards[i])
            this.outlines.push(new Outline())
        }
        // Remember the last card for possible later amending.
        const idx = this.cards.length-1
        Outline.last_card = this.cards[idx]
    }
    flatten_outline() {
        var stack = [this]
        var output = []
        while (stack.length > 0) {
            var outline = stack.shift()
            if (outline == null) {
                output.push(null)
                continue
            } else {
                const cards = outline.get_cards_padded()
                const breadCrumb = outline.breadCrumb
                output.push({cards:cards, breadCrumb:breadCrumb})
            }
            const N = outline.outlines.length
            for (let i=0; i<N; i++) {
                let new_outline = outline.outlines[i]
                let element = new_outline.cards.length > 0 ? new_outline : null
                stack.push(element)
            }
        }
        return output
    }
    get_cards_padded() {
        let N_cards = this.cards.length
        if (N_cards > 54)
            throw "Outline items exceed supported number of 54!"
        let N_new_cards = 0
        if (N_cards == 0 || N_cards == 6  || N_cards == 24 || N_cards == 54  )
            N_new_cards = 0
        else if (N_cards < 6)
            N_new_cards = 6-N_cards
        else if (N_cards < 24)
            N_new_cards = 24-N_cards
        else if (N_cards < 54)
            N_new_cards = 54-N_cards
        let cards = this.cards.slice()
        for (let i=0; i<N_new_cards; i++)
            //cards.push(new Card('', -1))
            cards.push(null)
        return cards.length == 0 ? null: cards
    }
    init_guidance(outline, parent_outline, title, level) {
        if (parent_outline == null)
            outline.breadCrumb.name = '/ ' + title
        else {
            const new_title = parent_outline.breadCrumb.name + ' / ' + title
            outline.breadCrumb.name = new_title
            outline.breadCrumb.context = [...parent_outline.breadCrumb.context] // Make a copy
        }
        outline.breadCrumb.add_to_context(this.main_section_parser, 'value'+level)
        for (let i=0; i<outline.outlines.length; i++) {
            if (outline.outlines[i].cards.length==0)
                continue
            const title_delta = outline.cards[i].content.parts[0].content.content
            this.init_guidance(outline.outlines[i], outline, title_delta, level+1)
        }
    }
}

class BodyParser {
    constructor(outline, outline_json) {
        this.outline = outline
        this.outline_json = outline_json
        this.parse_body(this.outline_json)
    }
    parse_body(outline_json) {
        const N = outline_json.length
        for (let i=0; i<N; i++) {
            let queue = [outline_json[i]]
            while (queue.length > 0) {
                const item = queue.shift()
                if (item.type === 'headline') {
                    //const content = item.title
                    assert(item.properties.title.length==1)
                    const content = item.properties.title[0]
                    const level = item.properties.level-1
                    const type = 'h'+(level+1)
                    let new_card = new Card(level)
                    new_card.add_content_part(type, {type:"string", content:content})
                    this.outline.append_new_card(new_card)
                    this.last_level = level

                    // Depth-first search strategy
                    for (let i=item.contents.length-1; i>=0; i-- )
                        // unshift places items in front of an array
                        queue.unshift(item.contents[i])
                }
                else if (item.type === 'section') {
                    const new_cards = this.parse_section(item, this.last_level+1)
                    for (let i=0; i<new_cards.length; i++)
                        this.outline.append_new_card(new_cards[i])
                }
            }
        }
    }
    parse_section(section, level) {
        assert(section.type=='section', 'Not a section!')
        const N = section.contents.length
        // Zero indicates that new parts will be appened to the last card.
        // Non-zero indicates that a new card needs to be allocated.
        let state = {cards: [], last_post_blank: -1 }
        for (let i=0; i<N; i++) {
            let item = section.contents[i]
            if (item.type == 'drawer') {
                state = this._parse_section_drawer(item, state, level)
            }
            else {
                assert(item.type === 'paragraph' || item.type === 'plain-list')
                state = this._parse_section_item(item, state, level)
            }
        }
        return state.cards
    }
    _parse_section_drawer(item, state, level) {
        let state_tmp = {cards: [], last_post_blank: -1 }
        for (let i=0; i<item.contents.length; i++) {
            state_tmp = this._parse_section_item(item.contents[i], state_tmp, level)
        }
        
        const N_cards = state_tmp.cards.length
        for (let i=0; i<N_cards; i++) {
            const new_card_part = state_tmp.cards[i].content
            if (state.cards.length > 0)
                state.cards[state.cards.length-1].amend_mnemonic(new_card_part)
            else 
                Outline.last_card.amend_mnemonic(new_card_part)
        }
        state.last_post_blank = item.properties["post-blank"]
        return state
    }
    _parse_section_item(item, state, level) {
        const post_blank_pos = get_post_blank_positions(item.contents)
        for (let j=0; j<post_blank_pos.length-1; j++) {
            const idx0 = post_blank_pos[j]
            const idx1 = post_blank_pos[j+1]
            const contents = item.contents.slice(idx0,idx1)
            let new_card_part = null
            switch(item.type) {
                case 'paragraph': new_card_part = make_paragraph(contents); break
                case 'plain-list': new_card_part = make_plain_list(contents); break
                default: throw "Implement!"
            }
            if (state.last_post_blank == 0) {
                const idx = state.cards.length-1
                state.cards[idx].amend_content(new_card_part)
            }
            else {
                let new_card = new Card(level)
                new_card.amend_content(new_card_part)
                state.cards.push(new_card)
            }
            if (typeof item.contents[idx1-1] === 'object')
                state.last_post_blank = item.contents[idx1-1].properties['post-blank']
            else
                state.last_post_blank = item.properties['post-blank']
        }
        return state
    }
    
}

class MainSectionParser {
    constructor(main_section) {
        this.main_section = main_section
        this.cards = null
        this.settings = {}
        this.init()
    }
    get_cards() {
        return this.cards
    }
    init() {
        const level = 0
        this.parse_main_section(this.main_section, level)
    }
    parse_main_section(main_section, level) {
        assert(main_section.type=='section', 'Not a section!')
        const N = main_section.contents.length
        // Zero indicates that new parts will be appened to the last card.
        // Non-zero indicates that a new card needs to be allocated.
        let state = {cards: [], last_post_blank: -1 }
        let last_item_was_title = false
        for (let i=0; i<N; i++) {
            let item = main_section.contents[i]
            if (item.type == 'keyword') {
                last_item_was_title = true
                assert(item.properties.key === "TITLE")
                this.settings['title'] = item.properties.value
            }
            else if (item.type == 'drawer') {
                if (last_item_was_title) {
                    last_item_was_title = false
                    this._parse_main_section_settings(item)
                }
                else
                    state = this._parse_main_section_drawer(item, state, level)
            }
            else {
                assert(item.type === 'paragraph' || item.type === 'plain-list')
                state = this._parse_main_section_item(item, state, level)
                last_item_was_title = false
            }
        }
        this.cards = state.cards
    }
    _parse_main_section_drawer(item, state, level) {
        let state_tmp = {cards: [], last_post_blank: -1 }
        for (let i=0; i<item.contents.length; i++) {
            state_tmp = this._parse_main_section_item(item.contents[i], state_tmp, level)
        }
        
        const idx = state.cards.length-1
        const N_cards = state_tmp.cards.length
        for (let i=0; i<N_cards; i++) {
            const new_card_part = state_tmp.cards[i].content
            state.cards[idx].amend_mnemonic(new_card_part)
        }
        state.last_post_blank = item.properties["post-blank"]
        return state
    }
    _parse_main_section_item(item, state, level) {
        const post_blank_pos = get_post_blank_positions(item.contents)
        for (let j=0; j<post_blank_pos.length-1; j++) {
            const idx0 = post_blank_pos[j]
            const idx1 = post_blank_pos[j+1]
            const contents = item.contents.slice(idx0,idx1)
            let new_card_part = null
            switch(item.type) {
                case 'paragraph': new_card_part = make_paragraph(contents); break
                case 'plain-list': new_card_part = make_plain_list(contents); break
                default: throw "Implement!"
            }
            if (state.last_post_blank == 0) {
                const idx = state.cards.length-1
                state.cards[idx].amend_content(new_card_part)
            }
            else {
                let new_card = new Card(level)
                new_card.amend_content(new_card_part)
                state.cards.push(new_card)
            }
            if (typeof item.contents[idx1-1] === 'object')
                state.last_post_blank = item.contents[idx1-1].properties['post-blank']
            else
                state.last_post_blank = item.properties['post-blank']
        }
        return state
    }
    _parse_main_section_settings(item) {
        assert(item.properties["drawer-name"] == 'mnemonic')
        assert(item.contents.length == 1)
        const contents = item.contents[0]
        for (let i=0; i<contents.contents.length; i++) {
            const content = contents.contents[i]
            const key = content.properties.tag[0]
            const value = content.contents[0].contents[0]
            this.settings['value'+i] = value
            this.settings['key'+i] = key
            console.log(key+", "+value)
        }
    }
}
