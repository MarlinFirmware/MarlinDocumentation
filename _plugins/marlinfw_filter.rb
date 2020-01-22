module Jekyll
  module MarlinSiteFilter
    def indexify(input)
      re0 = /<[^>]*>/
      re1 = /(\b([a-z]{,2}|a(ll|nd|re(n\'t)?)|but|can(\'t|not)?|d(id|oes)(n\'t)?|end|for|ha(d|s|ve)(n\'t)?|it\'?s|odd|use[ds]?|even|from|many|more|much|some|this|tha[nt]|th[eo]se|the([mny]|ir|re|y\'re)?|was|were(n\'t)?|wh(at|en|ere|ich|o|y)|will|won\'t|other|users?|people|(al)?though|your?)\b)|(\s+)/
      re2 = /!\[[^\]]+\]\([^\)]+\)\s*(\{[^\}]+\})?/
      re3 = /\[([^\]]+)\]\([^\)]+\)\s*(\{[^\}]+\})?/
      re4 = /\\q/
      re5 = /(EN|DIS)ABLED\(([^\)]+)\)/i
      re6 = /([[:punct:]]|:| [a-z])[ \t\n]+|[\n\r]+|\\[nr]/
      re7 = /[`\(\)\[\]:]+/
      # This will be returned
      input.downcase.gsub(re0, '').gsub(re1, ' ').gsub(re2, ' ').gsub(re3, '\1').gsub(re4, '\1').gsub(re5, '\2').gsub(re6, ' ').gsub(re7, '').split(' ').compact.uniq.join(' ')
    end
    def linkify(input)
      re1 = /([GM])(\d)\b/
      re2 = /([GM])(\d\d)\b/
      input.upcase.gsub(re1, '\100\2').gsub(re2, '\10\2').gsub(/G00[01]/, 'G000-G001').gsub(/G00[23]/, 'G002-G003').gsub(/G01[7-9]/, 'G017-G019').gsub(/G05[4-9]/, 'G054-G059').gsub(/M00[01]/, 'M000-M001').gsub(/M084/, 'M018').gsub(/\.\d/, '')
    end
  end
end

Liquid::Template.register_filter(Jekyll::MarlinSiteFilter)
