#!/bin/bash
#
# Compiles pertinent Closure library files. Excludes various files that should
# not be compiled (e.g., nodejs modules).

java -jar ../closure-compiler/build/compiler.jar \
  -O ADVANCED \
  --warning_level VERBOSE \
  --js='**.js' \
  --js='!**_test.js' \
  --js='!**_perf.js' \
  --js='!**tester.js' \
  --js='!**promise/testsuiteadapter.js' \
  --js='!**osapi/osapi.js' \
  --js='!**svgpan/svgpan.js' \
  --js='!**\./node_modules**.js' \
  --js='!**protractor_spec.js' \
  --js='!**protractor.conf.js' \
  --js='!**alltests.js' \
  --jscomp_off=deprecated   \
  --js_output_file=$(mktemp);
