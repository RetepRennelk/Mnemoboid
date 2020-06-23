function assert(condition, message) {
    if (!condition) {
        message = message || "Assertion failed";
        if (typeof Error !== "undefined") {
            throw new Error(message);
        }
        throw message; // Fallback
    }
}
function fetchOutlineAndExecute(filename, execute) {
    fetch(filename)
        .then(response => response.json())
        .then(data => execute(data))
		.catch (error => console.log ("error: " + error))
}
function make_paragraph(contents) {
    const N = contents.length
    let cardPart = new CardPart()
    for (let j=0; j<N ; j++) {
        if (typeof contents[j] === 'string') {
            const lines = contents[j].split('\n')        
            for (let i=0; i<lines.length; i++) {
                let line = lines[i]
                cardPart.add('p', {type: 'string', content: line})
            }
        } else {
            assert(contents[j].type === 'link')
            assert(contents[j].properties.type === 'file')
            let path = contents[j].properties.path
            if (path.endsWith('png') || path.endsWith('jpg') || path.endsWith('jpeg')) {
                // TODO Handle the alt-property possibly carried in the contents of this node.
                cardPart.add('p', {type:'img', content: path})
            } else {
                let desc = contents[j].contents.length > 0 ? contents[j].contents[0] : null
                cardPart.add('p', {type:'a', link: path, desc: desc})
            }
        }
    }
    return cardPart
}
function make_plain_list(contents) {
    const N = contents.length
    let cardPart = new CardPart()
    for (let j=0; j<N ; j++) {
        assert(contents[j].type == 'item')
        assert(contents[j].contents.length == 1)
        assert(contents[j].contents[0].type === 'paragraph')
        
        const card_part_temp = make_paragraph(contents[j].contents[0].contents)
        const N_cards = card_part_temp.parts.length
        for (let i=0; i<N_cards; i++) {
            const part = card_part_temp.parts[i]
            assert(part.type=='p' || part.type=='img')
            cardPart.add('li', part.content)
        }
    }
    return cardPart
}
function get_post_blank_positions(contents) {
    let pos = [0]
    for (let i=0; i<contents.length; i++) {
        let post_blank = 0
        if (typeof contents[i] === 'object')
            post_blank = contents[i].properties['post-blank']
        if (post_blank > 0)
            pos.push(i+1)
    }
    if (pos.slice(-1)[0] !== contents.length)
        pos.push(contents.length)
    return pos
}
function set_scene_children_style_display(scene, value) {
    const N = scene.children.length
    for (let i=0; i<N; i++) {
        let child = scene.children[i]
        const M = child.children.length
        if (M > 0) {
            set_scene_children_style_display(child, value)
        } else {
            child.element.style.display = value
        }
    }
}
function add_hidden_resizer(resizer_id) {
    var div = document.createElement('div')
    div.id = resizer_id
    document.body.appendChild(div)
}
