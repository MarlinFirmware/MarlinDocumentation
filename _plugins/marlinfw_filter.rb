module Jekyll
  module MarlinSiteFilter
    def indexify(input)
      # This will be returned
      some = input.downcase
      some = some.gsub(/<[^>]*>/, '')
      some = some.gsub("’", "'")
      some = some.gsub("“", '"')
      some = some.gsub("-", ' ')
      some = some.gsub('průša', 'prusa')
      some = some.gsub(/\b([a-z]{,2})\b/, '')
      some = some.gsub(/\b(a(ll|nd|re(n't)?)|(be)?cause|but|can('t|not)?|d(id|oes)(n't)?|end|for|from|ha(d|s|ve)(n't)?|it'?s|odd|use[ds]?|even|from|man?y|more|much|not|see|since|significant(ly)?|some|t?here|this|tha[nt]|th[eo]se|the([mny]|ir|re|y're)?|true|(was|were)(n't)?|wh(at|en|ere|ich|o|y)|will|with(out)?|won't|other|users|people|(al)?though|you'?r?e?|one|two)\b/, '')
      some = some.gsub(/!\[[^\]]+\]\([^\)]+\)\s*(\{[^\}]+\})?/, ' ')
      some = some.gsub(/\[([^\]]+)\]\([^\)]+\)\s*(\{[^\}]+\})?/, '\1')
      some = some.gsub(/\\q/, '\1')
      some = some.gsub(/(EN|DIS)ABLED\(([^\)]+)\)/i, '\2')
      some = some.gsub(/([[:punct:]]|:| [a-z])[ \t\n]+|[\n\r]+|\\[nr]/, ' ')
      some = some.gsub(/[`\(\)\[\]:]+/, '')
      some = some.split(' ').compact.uniq.join(' ')
      some
    end

    def linkify(input)
      re1 = /([GM])(\d)\b/
      re2 = /([GM])(\d\d)\b/
      input.upcase.gsub(re1, '\100\2').gsub(re2, '\10\2').gsub(/G00[01]/, 'G000-G001').gsub(/G00[23]/, 'G002-G003').gsub(/G01[7-9]/, 'G017-G019').gsub(/G05[4-9]/, 'G054-G059').gsub(/M00[01]/, 'M000-M001').gsub(/M084/, 'M018').gsub(/\.\d/, '')
    end

    def codes_desc(input)
      out = input[0]
      if input.size > 1
        re1 = /([GM])(\d+).*$/
        doc1 = out.gsub(re1, '\2')
        doc2 = input.last.gsub(re1, '\2')
        out += doc2.to_i - doc1.to_i < 10 ? '-' : ', '
        out += input.last
      end
      out
    end

  end
end

Liquid::Template.register_filter(Jekyll::MarlinSiteFilter)
