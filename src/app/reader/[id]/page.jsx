"use client";
import React, { useEffect, useState } from "react";
import { ReactReader } from "react-reader";
import styles from "./reader.module.scss";
import { getBookByIdRequest} from "@/app/redux/saga/requests/book";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading/Loading";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Checkbox,
} from "@nextui-org/react";
import { addNewOrUpdateReadHistory, findOneReadHistoryRequest } from "@/app/redux/saga/requests/book";

const Reader = () => {
  const [location, setLocation] = useState(0);
  const params = useParams();
  const id = params.id;
  const [book, setBook] = useState(null);
  const [selections, setSelections] = useState([]);
  const [rendition, setRendition] = useState(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [scrollBehavior, setScrollBehavior] = React.useState("inside");
  let currentAccount = JSON.parse(localStorage.getItem("user"));
  const fetcher = (...args) => fetch(...args).then((res) => res.json());

  const highlighters = [
    { value: "#ff9fae", label: "red", color: "#ff9fae" },
    { value: "#fde995", label: "yellow", color: "#fde995" },
    { value: "#a6e1c5", label: "green", color: "#a6e1c5" },
    { value: "#a7e0f6", label: "blue", color: "#a7e0f6" },
    { value: "#e1a7fb", label: "purple", color: "#e1a7fb" },
  ];
  const [selectedHighlighter, setSelectedHighlighter] = useState(
    highlighters[0].color
  );
  // const [currentPosition, setCurrentPosition] = useState(0);

  // Hàm để cập nhật vị trí đọc khi người dùng chuyển đến trang mới
  const handlePageChange = (newPosition) => {
    setLocation(newPosition);
    saveReadPositionToDatabase(newPosition);
  };

  // Hàm để lưu vị trí đọc vào database
  const saveReadPositionToDatabase = (newPosition) => {
    // console.log("savelocation, currentAccount:", currentAccount);
    if (currentAccount) {
      addNewOrUpdateReadHistory({
        book: book,
        user: currentAccount._id,
        position: newPosition,
      });
    }
  };

  const handleSelectHighlighter = (event) => {
    const selectedValue = event.target.value;
    setSelectedHighlighter(selectedValue);
  };

  useEffect(() => {
    getBookByIdRequest(id).then((res) => {
      setBook(res.book);
      console.log("epub:", res.book);
  
      // Kiểm tra nếu book
      if (res.book) {
        findOneReadHistoryRequest(res.book._id, currentAccount._id).then((res) => {
          console.log("findOneReadHistoryRequest", res.book);
  
          try {
            // Set vị trí đọc cho ReactReader
            setLocation(res.position);
            console.log("vị đang đọc trước đó", res.position);
          } catch (error) {
            console.error("Lỗi khi lấy thông tin vị trí đọc:", error);
          }
        });
      }
    });
  }, []);

  useEffect(() => {
    if (rendition) {
      function setRenderSelection(cfiRange, contents) {
        if (rendition) {
          setSelections((list) =>
            list.concat({
              text: rendition.getRange(cfiRange).toString(),
              cfiRange,
            })
          );
          rendition.annotations.add(
            "highlight",
            cfiRange,
            {},
            undefined,
            "hl",
            {
              fill: selectedHighlighter,
              "fill-opacity": "0.5",
              "mix-blend-mode": "multiply",
            }
          );
          const selection = contents.window.getSelection();
          selection?.removeAllRanges();
        }
      }
      rendition.on("selected", setRenderSelection);
      return () => {
        rendition?.off("selected", setRenderSelection);
      };
    }
  }, [setSelections, rendition, selectedHighlighter]);

  return (
    <div className={styles.readerContainer}>
      <div className={styles.settingContainer}>
        <div className={styles.highlighterSetting}>
          Highlighter color:
          <select
            id="options"
            style={{ marginLeft: "10px" }}
            onChange={handleSelectHighlighter}
            value={selectedHighlighter}
          >
            {highlighters.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div style={{ marginTop: "10px" }}>
            {highlighters.map((option) => (
              <div
                key={option.value}
                style={{ display: "flex", alignItems: "center" }}
              >
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    backgroundColor: option.color,
                    marginRight: "10px",
                    borderRadius: "5px",
                  }}
                />
                {option.label}
              </div>
            ))}
          </div>
        </div>
        <div className={styles.highlightedList}>
          {" "}
          <Button onPress={onOpen}>View highlighted</Button>
        </div>
      </div>

      <div className={styles.bookReaderContainer}>
        {!book ? (
          <Loading />
        ) : (
          <ReactReader
            title={book.name}
            url={book.epub}
            location={location}
            locationChanged={(newPosition) => handlePageChange(newPosition)}
            getRendition={(p) => setRendition(p)}
          />
        )}
      </div>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior={scrollBehavior}
        placement="center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Highlighted list
              </ModalHeader>
              <ModalBody>
                <div className="border border-stone-400 bg-white min-h-[100px] p-2 rounded">
                  <ul className="grid grid-cols-1 divide-y divide-stone-400 border-t border-stone-400 -mx-2">
                    {selections.length === 0 ? (
                      <>Don't have any highlighted yet!</>
                    ) : (
                      selections.map(({ text, cfiRange }, i) => (
                        <li key={i} className="p-2">
                          <span>{text}</span>
                          <button
                            className="underline hover:no-underline text-sm mx-1"
                            onClick={() => {
                              rendition?.display(cfiRange);
                            }}
                          >
                            Show
                          </button>

                          <button
                            className="underline hover:no-underline text-sm mx-1"
                            onClick={() => {
                              rendition?.annotations.remove(
                                cfiRange,
                                "highlight"
                              );
                              setSelections(
                                selections.filter((item, j) => j !== i)
                              );
                            }}
                          >
                            Remove
                          </button>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Reader;
