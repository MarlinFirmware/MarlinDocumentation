module Jekyll
  module IndexifyFilter
    def indexify(input)
      re0 = /<[^>]*>/
      re1 = /(\b(a[mnst]?|[a-z][a-z]|a(ll|nd|re)|but|can(\'t|not)?|d(id|oes)(n\'t)?|end|for|it\'?s|odd|the|use[ds]?|was|wh[oy]|your?|even|from|many|more|much|some|th[ae]n|that|the[my]|this|were|what|when|will|other|th[eo]se|the(ir|re)|users?|wh(ere|ich)|people|(al)?though)\b)|(\s+)/
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
