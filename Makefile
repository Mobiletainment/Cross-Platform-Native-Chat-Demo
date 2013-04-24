
build:
	zip -r app.nw app/*
	mv -f app.nw ./runtime/CPA-Chat.app/Contents/Resources/app.nw

clean:
	rm -rf app.nw

.PHONY: clean
