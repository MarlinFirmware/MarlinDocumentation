module Jekyll
  module IndexifyFilter
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
  end
end

Liquid::Template.register_filter(Jekyll::IndexifyFilter)
