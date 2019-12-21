#
# jekyll-pub.workflow
#
# Publish the Jekyll site whenever 'master' is pushed
#

workflow "Jekyll build now" {
  resolves = [ "Jekyll Action" ]
  on = "push"
}

action "Jekyll Action" {
  uses = "actions/checkout@v1"
  secrets = [ "JEKYLL_PAT" ]
}
