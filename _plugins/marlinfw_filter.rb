module Jekyll
  module MarlinSiteFilter
    def indexify(input)
      # Reduce text down to searchable terms
      some = input.downcase
      some = some.gsub('průša', 'prusa')
      some = some.gsub(/(<[^>]*>|$$.+$$)/, '')
      some = some.gsub(/(en|dis)abled\(([^\)]+)\)/i, '\2')
      some = some.gsub(/!\[[^\]]+\]\([^\)]+\)(\s*\{[^\}]+\})?/, ' ')
      some = some.gsub(/\[([^\]]+)\]\([^\)]+\)(\s*\{[^\}]+\})?/, '\1')
      some = some.gsub(/(#define|alert (info|warning)|endalert)/, '')
      some = some.gsub(/[^0-9a-z'_ ]/, ' ')
      some = some.gsub(/((ca|is|wo)?n't|'re|'s)/, '')
      some = some.gsub(/\b[a-z]{,2}\b/, '')
      some = some.gsub(/\b(a(ll|nd|re)|also|(be)?cause|b.t|cannot|d(id|oes)|end|even|for|from|g[eiou]t|ha(d|s|ve)?|how|[iou]nto|its|odd|out|use[ds]?|life|may(be)?|man?y|more|much|not|pre|see|since|sign(ificant(ly)?)?|some(what)?|such|t?here|this|tha[nt]|th[eo]se|the([mny]|ir|re|y)?|too|true|(was|were)|wh(at|en|ere|ich|o|y)|will|with(out)?|other|users|people|(al)?though|your?|n?one|two|via)\b/, '')
      some = some.gsub(/( '|' )/, '')
      #some = some.gsub(/\b(([a-z]{,3})?_[a-z0-9]{,3})\b/, '')
      some = some.gsub(/\b(\d+(kb?)?|0x\h+)\b/, '')
      some = some.gsub(/([[:punct:]]|:| [a-z])[ \t\n]+|[\n\r]+|\\[nr]/, ' ')
      some = some.split(' ').compact.uniq.join(' ')
      some
    end

    def linkify(input)
      re1 = /([GM])(\d)\b/
      re2 = /([GM])(\d\d)\b/
      input.upcase.gsub(re1, '\100\2').gsub(re2, '\10\2').gsub(/G00[01]/, 'G000-G001').gsub(/G00[23]/, 'G002-G003').gsub(/G01[7-9]/, 'G017-G019').gsub(/G05[4-9]/, 'G054-G059').gsub(/M00[01]/, 'M000-M001').gsub(/M084/, 'M018').gsub(/\.\d/, '')
    end

    def codes_desc(input)
      if input != nil
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
end

Liquid::Template.register_filter(Jekyll::MarlinSiteFilter)
