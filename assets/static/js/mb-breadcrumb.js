class BreadCrumb {
    constructor() {
        this.name = ''
        this.context = []
    }
    add_to_name(s) {
        this.name += s
    }
    add_to_context(main_section_parser, item) {
        let x = 'undefined'
        if (main_section_parser)
            x = main_section_parser.settings[item]
        this.context.push(x)
    }
}
