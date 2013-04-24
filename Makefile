
build:
	cd app; npm run-script package	
	cp app.nw ./runtime/app.nw
	mv -f app.nw ./runtime/CPA-Chat.app/Contents/Resources/app.nw

clean:
	rm -rf app.nw
	rm -rf ./runtime/app.nw

.PHONY: clean
