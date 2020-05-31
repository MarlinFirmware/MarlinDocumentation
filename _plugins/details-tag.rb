module Jekyll
  class Details < Liquid::Block
    include Jekyll::Filters

    def initialize(tag_name, markup, tokens)
      super
    end

    def render(context)
      @context = context
      source  = "<details><summary>Click for Details</summary>"
      source += "  #{markdownify(super)}"
      source += "</details>"
    end
  end
end

Liquid::Template.register_tag('details', Jekyll::Details)
