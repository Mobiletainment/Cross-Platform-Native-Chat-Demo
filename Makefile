
build:
	cd app; npm run-script package	
	mv -f app.nw ./runtime/CPA-Chat.app/Contents/Resources/app.nw

clean:
	rm -rf app.nw

.PHONY: clean
