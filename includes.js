exports.FILE_TYPES = filename => {
	let ext =
		filename.substring(filename.lastIndexOf("."), filename.length) ||
		filename;
	let type;
	switch (ext.toLowerCase()) {
		case ".pdf":
			type = "PDF";
			break;
		case ".docx":
		case ".doc":
			type = "Word Document";
			break;
		case ".xlsx":
			type = "Spreadsheet";
			break;
		case ".pptx":
		case ".ppt":
			type = "PowerPoint";
			break;
		default:
			type = "Unknown";
	}

	return type;
};

exports.FILE_SIZE = rawSize => {
     let int_size = parseInt(rawSize);
		let size = (int_size / 1024).toFixed(2)

		if (size < 1024) {
			return size + " KB";
		} else if (size > 1024 && size < 1024 * 2) {
			return size + " MB";
		} else if (size > 1024 * 2 && size < 1024 * 3) {
			return size + " GB";
		} else if (size > 1024 * 3 && size < 1024 * 4) {
			return size + " TB";
		} else {
			return 0;
		}
}


exports.TEXT_TRUNCATION =  (str, length, ending) => {
	if (length == null) {
		length = 100;
	}
	if (ending == null) {
		ending = "...";
	}
	if (str.length > length) {
		return str.substring(0, length - ending.length) + ending;
	} else {
		return str;
	}
};
