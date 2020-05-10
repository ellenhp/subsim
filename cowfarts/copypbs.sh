cd ..
ls mass/api/*.proto | xargs protoc --proto_path=. \
  --js_out=import_style=commonjs,binary:cowfarts/src/__protogen__ \
  --grpc-web_out=import_style=typescript,mode=grpcwebtext:cowfarts/src/__protogen__
cd cowfarts
