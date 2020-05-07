cd ..
ls mass/api/*.proto | xargs protoc --proto_path=. \
  --js_out=import_style=commonjs:grossclient/src/__protogen__ \
  --grpc-web_out=import_style=commonjs,mode=grpcwebtext:grossclient/src/__protogen__
cd grossclient

npm run build
