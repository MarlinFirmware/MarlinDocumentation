#
# Sort the G-code sidebar by code number instead of title.
#
# Just the Docs orders pages without a `nav_order` by `title`, so "M209: ..." sorts before "M20: ..."
# (':' follows '9'). Each docs/gcode page has a zero-padded `tag` (m0020, m0209) that sorts in code
# order, so use it as the default `nav_order`. An explicit `nav_order` in frontmatter still wins.
#
Jekyll::Hooks.register :pages, :post_init do |page|
  next unless page.relative_path.start_with?('docs/gcode/')
  next if page.data.key?('nav_order') || page.data['tag'].nil?
  page.data['nav_order'] = page.data['tag'].to_s
end
