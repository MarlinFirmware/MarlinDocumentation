module Jekyll
  class Details < Liquid::Block
    include Jekyll::Filters

    def initialize(tag_name, markup, tokens)
      super
      @title = markup.strip!
      @title = "Click for Details" if @title.nil? || @title.empty?
    end

    def render(context)
      @context = context
      source  = "<details><summary>#{@title}</summary>"
      source += "  #{markdownify(super)}"
      source += "</details>"
    end
  end
end

Liquid::Template.register_tag('details', Jekyll::Details)
