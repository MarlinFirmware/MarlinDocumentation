require 'cgi'
require 'set'

#
# Link Marlin option names and G-codes to their docs pages.
#
# - Options: _data/setting_pages.yml (option -> docs/settings page, written by _tools/gen_settings.py).
#   Links only go to settings pages that exist in this build, so they never dangle.
# - G-codes: built from the `codes:` frontmatter of docs/gcode pages. For a code shared by variant
#   pages (G29 in G029-ubl, G029-mbl...), the base page wins.
#
# setting_links     - filter for a raw condition expression ('requires', 'block_clause')
# settings_autolink - filter for rendered HTML: links <code>NAME</code> and <code>G28</code> spans
#                     outside <pre> blocks and existing links
#
module Jekyll
  module MarlinSettingLinks
    NAME  = /\b[A-Z][A-Z0-9_]*[A-Z0-9]\b/
    GCODE = /\A[GMT]\d+(?:\.\d+)?\z/

    def setting_links(input)
      return '' if input.nil?
      CGI.escapeHTML(input.to_s).gsub(NAME) { |name| MarlinSettingLinks.link(@context, name) || "<code>#{name}</code>" }
    end

    def settings_autolink(html)
      return html if html.nil?
      html.to_s.split(%r{(<pre\b.*?</pre>|<a\b.*?</a>)}m).map.with_index do |chunk, i|
        i.odd? ? chunk : chunk.gsub(%r{<code(?:\s[^>]*)?>(#{NAME})</code>}) { MarlinSettingLinks.link(@context, $1) || $& }
      end.join
    end

    # URL of the page documenting a G-code (e.g. 'G34' -> '/docs/gcode/G034-zsaa.html'), or nil
    def gcode_url(code)
      MarlinSettingLinks.gcode_pages(@context.registers[:site])[code.to_s.strip]
    end

    def self.link(context, name)
      site = context.registers[:site]
      base = site.config['baseurl']
      if name =~ GCODE
        page = gcode_pages(site)[name] or return nil
        return "<a href=\"#{base}#{page}\"><code>#{name}</code></a>"
      end
      slug = (site.data['setting_pages'] || {})[name] or return nil
      url = "/docs/settings/#{slug}.html"
      return nil unless settings_urls(site).include?(url)
      "<a href=\"#{base}#{url}##{name}\"><code>#{name}</code></a>"
    end

    # Per-build caches
    def self.fresh(site)
      if @site_id != site.object_id || @build != site.time
        @site_id, @build, @urls, @gcodes = site.object_id, site.time, nil, nil
      end
    end

    def self.settings_urls(site)
      fresh(site)
      @urls ||= site.pages.map(&:url).select { |u| u.start_with?('/docs/settings/') }.to_set
    end

    def self.gcode_pages(site)
      fresh(site)
      @gcodes ||= begin
        map = {}
        # Base pages first (G029 before G029-ubl); combined pages like G000-G001 count as base pages
        site.pages.select { |p| p.url.start_with?('/docs/gcode/') && p.data['codes'] }
                  .sort_by { |p| [p.url =~ %r{/[GMT]\d+-[a-z]} ? 1 : 0, p.url] }
                  .each { |p| Array(p.data['codes']).each { |c| map[c.to_s.strip] ||= p.url } }
        map
      end
    end
  end
end

Liquid::Template.register_filter(Jekyll::MarlinSettingLinks)
