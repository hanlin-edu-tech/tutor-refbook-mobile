#!/bin/bash
test="http://test.ehanlin.com.tw/event/api/Deploy"
production="http://www.ehanlin.com.tw/event/api/Deploy"
repository="{\"Repository\":\"event-collection_107\",\"Tag\":\"${TRAVIS_TAG}\",\"Owner\":\"eHanlin\",\"Password\":\"${EHANLIN_PW}\",\"Name\":\"collection_107\"}"
contentTypeJson="Content-Type: application/json"

case "${TRAVIS_TAG}" in
*SNAPSHOT*)
	echo "deploy to test"
	curl -X POST -H "${contentTypeJson}" -d "${repository}" "${test}"
	;;
*)
	echo "deploy to production"
	curl -X POST -H "${contentTypeJson}" -d "${repository}" "${production}"
	;;
esac