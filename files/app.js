const fs = require("fs/promises");
const { Buffer } = require("buffer");

(async () => {
  // commands
  const CREATE_FILE = "create a file";
  const DELETE_FILE = "delete the file";
  const RENAME_FILE = "rename the file";
  const ADD_TO_FILE = "add to the file";

  // services
  const createFile = async (filePath) => {
    let existingFileHandler;
    try {
      existingFileHandler = await fs.open(filePath, "r");
      existingFileHandler.close();
      return console.log(`The file ${filePath} already exists`);
    } catch (error) {
      const newFileHandle = await fs.open(filePath, "w");

      console.log("new file was successfully created");
      newFileHandle.close();
    }
  };

  const deleteFile = async (filePath) => {
    try {
      await fs.unlink(filePath);
      console.log("file deleted:::");
    } catch (error) {
      if (error.code === "ENOENT") {
        console.log("No file at this path to remove");
      } else {
        console.log("an error occured while deleting the file at t");
        console.log(error);
      }
    }
  };

  const renameFile = async (oldPath, newPath) => {
    console.log(`renaming ${oldPath} to ${newPath}`);
  };

  const addToFile = async (path, content) => {
    console.log(`Adding to ${path}`);
    console.log(`Content: ${content}`);
  };

  const watcher = fs.watch("./command.txt");
  const commandFileHandler = await fs.open("./command.txt", "r");

  commandFileHandler.on("change", async () => {
    console.log("The file was changed:::");

    const size = (await commandFileHandler.stat()).size;
    const buff = Buffer.alloc(size);
    const offset = 0;
    const length = buff.byteLength;
    const content = await commandFileHandler.read({
      buffer: buff,
      byteOffset: offset,
      length: length,
    });
    const command = content.buffer.toString("utf-8");

    // create a file:
    // create a file <path>

    if (command.includes(CREATE_FILE)) {
      const filePath = command.substring(CREATE_FILE.length + 1);
      createFile(filePath);
    }

    // delete a file:
    // delete a file <path>
    if (command.includes(DELETE_FILE)) {
      const filePath = command.substring(DELETE_FILE.length + 1);
      deleteFile(filePath);
    }

    // rename a file:
    // rename the file <path> to <newpath>
    if (command.includes(RENAME_FILE)) {
      const _idx = command.indexOf(" to ");
      const oldFilePath = command.substring(RENAME_FILE.length + 1, _idx);
      const newFilePath = command.substring(_idx + 4);
      renameFile(oldFilePath, newFilePath);
    }

    // add to file
    // add to the file <path> this content: <content>
    if (command.includes(ADD_TO_FILE)) {
      const _idx = command.indexOf(" this content: ");
      const filePath = command.substring(ADD_TO_FILE.length + 1, _idx);
      const content = command.substring(_idx + 15);

      addToFile(filePath, content);
    }
  });

  for await (const event of watcher) {
    if (event.eventType == "change") {
      commandFileHandler.emit("change");
    }
  }
})();
