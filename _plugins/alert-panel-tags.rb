module Jekyll
  class Panel < Liquid::Block
    include Jekyll::Filters

    def initialize(tag_name, markup, tokens)
      super
      @attributes = {}
      @attributes = markup.split(" ")
      @type       = @attributes[0]

      @attributes.shift;
      @title = @attributes.join(" ")


      case @type
        when "success"
          @icon = "fa-check-square"
          @head = "Success"

        when "info"
          @icon = "fa-info-circle"
          @head = "Information"

        when "warning"
          @icon = "fa-exclamation-circle"
          @head = "Warning"

        when "danger"
          @icon = "fa-exclamation-triangle"
          @head = "Danger"

        else
          @icon = "fa-comment"
          @head = "Note"
          @type = 'default'
      end

      @title = @head if @title.nil? || @title.empty?
    end

    def render(context)
      @context = context

      source  = "<div class=\"panel panel-#{@type}\">"
      source += "<div class=\"panel-heading\">"
      source += "<i class=\"fa #{@icon} pull-left\" aria-hidden=\"true\"></i>"
      source += "<h4 class=\"panel-title\">#{@title}</h4></div>"
      source += "<div class=\"panel-body\"><p>#{markdownify(super)}</p></div>"
      source += "</div>"
    end
  end
end

module Jekyll
  class Alert < Liquid::Block
    include Jekyll::Filters

    def initialize(tag_name, markup, tokens)
      super
      @type = markup.strip!

      case @type
        when "success"
          @icon = "fa-check-square"

        when "info"
          @icon = "fa-info-circle"

        when "warning"
          @icon = "fa-exclamation-circle"

        when "danger"
          @icon = "fa-exclamation-triangle"

        else
          @icon = "fa-comment"
          @type = 'primary'
      end
    end

    def render(context)
      @context = context

      source  = "<div class='container-fluid'>"
      source += "  <div class='row alert alert-#{@type} custom-alert'>"
      source += "    <div class='col-lg-1 col-md-2 visible-lg-block visible-md-block custom-alert-icon'>"
      source += "      <i class='fa #{@icon} fa-4x' aria-hidden='true'></i>"
      source += "    </div>"
      source += "    <div class='col-lg-11 col-md-10 custom-alert-text'>"
      source += "      #{markdownify(super)}"
      source += "    </div>"
      source += "  </div>"
      source += "</div>"

    end
  end
end


Liquid::Template.register_tag('panel', Jekyll::Panel)
Liquid::Template.register_tag('alert', Jekyll::Alert)
