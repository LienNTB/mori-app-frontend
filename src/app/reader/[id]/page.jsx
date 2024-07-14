"use client";
import React, { useEffect, useRef, useState } from "react";
import { EpubView, ReactReader, useReader } from "react-reader";
import styles from "./reader.module.scss";
import { getBookByIdRequest } from "@/app/redux/saga/requests/book";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading/Loading";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Checkbox,
  Textarea,
  Switch,
  Slider,
} from "@nextui-org/react";
import {
  addNewOrUpdateReadHistory,
  findOneReadHistoryRequest,
} from "@/app/redux/saga/requests/book";
import {
  addNoteForBookRequest,
  deleteNoteForBookRequest,
  getNotesForBookByUserRequest,
  updateNoteForBookRequest,
} from "@/app/redux/saga/requests/note";
import { getMembershipByIdRequest } from "@/app/redux/saga/requests/membership";
import * as types from "@/app/redux/types";
import {
  faArrowRight,
  faCaretLeft,
  faCaretRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Epub from "epubjs";
import { updateReadBooksRequest, updateReadPagesRequest } from "@/app/redux/saga/requests/readingGoal";

const Reader = () => {
  const [location, setLocation] = useState(0);
  const params = useParams();
  const id = params.id;
  const [book, setBook] = useState(null);
  const [selections, setSelections] = useState([]);
  const [rendition, setRendition] = useState(null);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [scrollBehavior, setScrollBehavior] = React.useState("inside");
  const [currentAccount, setCurrentAccount] = useState(0);
  const [isSelectionMenuOpen, setSelectionMenuOpen] = useState(false);
  const [currentCfiRange, setCurrentCfiRange] = useState(null);
  const [currentContents, setCurrentContents] = useState("");
  const [contentNote, setContentNote] = useState("");
  const [isRenditionReady, setIsRenditionReady] = useState(false);
  const epubRef = useRef(null);
  const epubViewRef = useRef(null);
  const [showChapterMenu, setShowChapterMenu] = useState(false);
  const [chapters, setChapters] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null)
  const [editNoteInput, setEditNoteInput] = useState("")
  const [isLoadingNote, setIsLoadingNote] = useState(false)
  const {
    isOpen: isOpenChapters,
    onOpen: onOpenChapters,
    onOpenChange: onOpenChangeChapters,
    onClose: onCloseChapters,
  } = useDisclosure();
  const {
    isOpen: isOpenEditNote,
    onOpen: onOpenEditNote,
    onOpenChange: onOpenChangeEditNote,
    onClose: onCloseEditNote,
  } = useDisclosure();

  const [audioUrl, setAudioUrl] = useState("");
  const [nextAudioUrl, setNextAudioUrl] = useState("");
  const [sentences, setSentences] = useState([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [isReading, setIsReading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedSliderChaper, setSelectedSliderChapter] = useState(0);
  const [checkFinalPageCounter, setCheckFinalPageCounter] = useState(0)
  const [isCurrentSentenceProcessed, setIsCurrentSentenceProcessed] =
    useState(false);
  const audioRef = useRef(null);


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

  // Biến toàn cục để lưu trữ timeout hiện tại
  let debounceChapterTimeout;
  // Hàm để xử lý thay đổi của thanh trượt
  const handleSliderChange = (val) => {
    setSelectedSliderChapter(val);
    // Xóa timeout trước đó nếu có
    if (debounceChapterTimeout) {
      clearTimeout(debounceChapterTimeout);
    }
    // Thiết lập timeout mới để gọi handleChapterSelect sau một khoảng thời gian nhất định
    debounceChapterTimeout = setTimeout(() => {
      handleChapterSelect(chapters[val]);
      // update books progress for reading goal for user
      setCheckFinalPageCounter(p => p + 1);
    }, 300); // 300ms là khoảng thời gian debounce, có thể điều chỉnh tùy ý
  };

  // Thiết lập debounce timeout
  let debounceTimeout;
  // Hàm để cập nhật vị trí đọc khi người dùng chuyển đến trang mới
  const handlePageChange = (newPosition) => {
    setLocation(newPosition);
    // Xóa timeout trước đó nếu có
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    // Thiết lập timeout mới
    debounceTimeout = setTimeout(() => {
      saveReadPositionToDatabase(newPosition);
    }, 1000); // 1s là khoảng thời gian debounce, có thể điều chỉnh tùy ý
  };


  // Hàm để lưu vị trí đọc vào database
  const saveReadPositionToDatabase = (newPosition) => {
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
    setSelectedHighlighter(selectedValue)
  };

  const handleSaveNote = () => {
    const selectedText = rendition.getRange(currentCfiRange).toString();
    setSelections((list) =>
      list.concat({
        text: selectedText,
        cfiRange: currentCfiRange,
        color: selectedHighlighter,
      })
    );

    rendition.annotations.add(
      "highlight",
      currentCfiRange,
      {},
      undefined,
      "hl",
      {
        fill: selectedHighlighter,
        "fill-opacity": "0.5",
        "mix-blend-mode": "multiply",
      }
    );

    // gọi api
    if (currentAccount) {
      const request = {
        user: currentAccount._id,
        book: id,
        content: contentNote,
        text: selectedText,
        cfiRange: currentCfiRange,
        color: selectedHighlighter,
      };
      addNoteForBookRequest(request)
        .then(() => {
          getNoteData()
        })
    } else {
      alert("Vui lòng đăng nhập nếu bạn muốn lưu lại ghi chú");
    }
    setSelectionMenuOpen(false);
  };

  const renderAnnotations = (notes) => {
    // Xóa tất cả các điểm nhấn trước đó
    if (rendition) {
      rendition.annotations.remove();
    }
    // Thêm lại các điểm nhấn từ danh sách ghi chú
    notes.forEach(({ cfiRange, color }) => {
      rendition.annotations.add("highlight", cfiRange, {}, undefined, "hl", {
        fill: color,
        "fill-opacity": "0.5",
        "mix-blend-mode": "multiply",
      });
    });
  };

  const loadEpubFile = () => {
    const epub = new Epub(`${types.BACKEND_URL}/api/bookepub/${book.epub}`);
    epubRef.current = epub;

    // Get the chapter information
    epub.ready.then(() => {
      const chaptersInfo = epub.navigation.toc;
      setChapters(chaptersInfo);
      // Set the initial location
      setLocation(epub.locations.start);
    });

    return () => {
      epub.destroy();
    };
  };

  const getCurrentChapterIndex = (url) => {
    const currentChapterIndex = chapters.findIndex((chapter, index) => {
      return chapter.href === url
    })
    return currentChapterIndex
  }
  const handleNextPage = async () => {

    if (epubViewRef.current.rendition) {

      // locate to next page
      await epubViewRef.current.rendition.next().then(() => {
        // update current progress for slider
        const currentIndex = getCurrentChapterIndex(epubViewRef.current.rendition.location.start.href);
        setSelectedSliderChapter(currentIndex);
        setCheckFinalPageCounter(p => p + 1)
        // update progress for reading goal for user
        if (currentAccount) {
          updateReadPagesRequest(currentAccount._id)
        }
      })

      // retrieve text from current page
      const text = await getCurrentPageText(epubViewRef.current.rendition);
      const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || [text];
      setSentences(sentences);
      setCurrentSentenceIndex(0);


    }
    setPrevEpubViewRef(epubViewRef.current.location)

  };

  const handlePreviousPage = () => {
    if (epubViewRef.current) {
      epubViewRef.current.prevPage();
    }
  };

  const handleChapterSelect = async (chapter) => {
    if (epubViewRef.current && epubViewRef.current.rendition) {
      try {
        // Display the selected chapter
        await epubViewRef.current.rendition.display(chapter.href);

        // Hide the chapter menu
        setShowChapterMenu(false);
        onCloseChapters();
      } catch (error) {
        console.error("Error navigating to selected chapter:", error);
      }
    }
  };

  const handleCheckFinalChapter = () => {
    // check if user is logged in
    if (!currentAccount) return;
    if (epubViewRef?.current?.rendition) {
      const currentIndex = getCurrentChapterIndex(epubViewRef.current.rendition.location.start.href);
      if (currentIndex === chapters.length - 1) {
        // if user reach final page then update finish
        updateReadBooksRequest(currentAccount._id, params.id)
      }
    }
  }

  const handleEditNote = () => {
    if (!currentAccount) {
      return;
    }
    const request = {
      user: currentAccount._id,
      book: id,
      content: editNoteInput,
      cfiRange: selectedNote.cfiRange,
      color: selectedNote.color
    }
    toast.promise(
      new Promise((resolve, reject) => {
        updateNoteForBookRequest(request, selectedNote._id)
          .then((resp) => {
            if (resp.message) {
              resolve(resp.message);
              getNoteData()

            } else {
              reject(resp.error);
            }
          })
          .catch((err) => {

          });
      }),
      {
        loading: "Processing...",
        success: (message) => message,
        error: (error) => error,
      }
    );
  }

  // gọi đầu tiên
  useEffect(() => {
    const currentAccount = JSON.parse(localStorage.getItem("user"));
    setCurrentAccount(currentAccount);
    getBookByIdRequest(id).then((res) => {
      setBook(res.book);
      if (res.book && currentAccount) {
        findOneReadHistoryRequest(res.book._id, currentAccount._id).then(
          (res) => {
            setLocation(res.position);
          }
        );
      }
    });
  }, [id]);

  useEffect(() => {
    handleCheckFinalChapter()
  }, [checkFinalPageCounter])


  // khi selection
  useEffect(() => {
    if (rendition) {
      function setRenderSelection(cfiRange, contents) {
        if (rendition) {
          setCurrentCfiRange(cfiRange);
          setCurrentContents(contents);
          setSelectionMenuOpen(true);
        }
      }
      rendition.on("selected", setRenderSelection);
      return () => {
        rendition?.off("selected", setRenderSelection);
      };
    }
  }, [setSelections, rendition, selectedHighlighter]);

  // setIsRenditionReady để check set lại note nếu người dùng đã có note cũ
  useEffect(() => {
    if (rendition) {
      rendition.on("rendered", () => {
        setIsRenditionReady(true);
      });
    }
  }, [rendition, isDarkMode]);

  const getNoteData = () => {
    setIsLoadingNote(true)
    if (isRenditionReady && currentAccount) {
      getNotesForBookByUserRequest(book._id, currentAccount._id).then((res) => {
        setSelections(res.notes);
        renderAnnotations(res.notes);
      });
    }
    setIsLoadingNote(false)
  }
  const handleRemoveNote = (note) => {
    console.log("note", note._id)
    deleteNoteForBookRequest(note._id)
      .then(() => {
        getNoteData()
      })
  }
  useEffect(() => {
    getNoteData()
  }, [isRenditionReady]);

  // remove vị trí selection thôi
  useEffect(() => {
    if (!isSelectionMenuOpen && currentContents) {
      const selection = currentContents.window.getSelection();
      selection?.removeAllRanges();
    }
  }, [isSelectionMenuOpen, currentContents]);

  useEffect(() => {
    // if book is loaded then load epub data
    if (book) {
      loadEpubFile();
    }
  }, [book]);

  useEffect(() => {
    if (epubViewRef.current) {
      const rendition = epubViewRef.current.rendition;
      if (rendition) {
        updateTheme(rendition, isDarkMode);
      }
    }
  }, [isDarkMode]);

  const updateTheme = (rendition, isDarkMode) => {
    rendition.themes.register("custom", {
      body: {
        color: isDarkMode ? "#9CA3AF" : "#111827",
        background: isDarkMode ? "#31363F" : "#EEEEEE",
      },
    });
    rendition.themes.select("custom");
  };

  //////////// TTS Function
  const textToSpeech = async (text, speed, voice) => {
    try {
      const response = await axios.post(
        `${types.BACKEND_URL}/api/book/get-book/textToSpeech`,
        { text, speed, voice }
      );
      return response.data.audioUrl;
    } catch (error) {
      console.error("Error converting text to speech:", error);
      return null;
    }
  };

  const getCurrentPageText = async (rendition) => {
    const currentContents = rendition.getContents();
    let pageText = "";

    currentContents.forEach((content) => {
      const text = content.document.body.textContent;
      pageText += text;
    });
    return pageText;
  };

  const handleReadPage = async () => {
    const membershipRequest = await getMembershipByIdRequest(
      currentAccount._id
    );
    if (!membershipRequest.membership) {
      toast.error("Vui lòng đăng kí gói cước để sử dụng tính năng này!", {
        duration: 2000,
      });
    } else {
      if (rendition) {
        const text = await getCurrentPageText(rendition);
        // Thay thế các ký tự xuống dòng và tab bằng dấu cách, loại bỏ khoảng trắng dư thừa và sau đó tách thành các câu
        const sentences = text
          .replace(/[\n\t]/g, " ")
          .replace(/\s+/g, " ")
          .match(/[^\.!\?]+[\.!\?]+/g) || [text];
        // Lọc ra các câu không chỉ toàn dấu cách hoặc không có ký tự
        const filteredSentences = sentences.filter(
          (sentence) => /[^\s.]/.test(sentence.trim()) // Kiểm tra câu không chỉ toàn dấu cách
        );
        setSentences(filteredSentences);
        setCurrentSentenceIndex(0);
        setIsReading((prevState) => !prevState); // Đảo ngược giá trị của isReading để gọi useffect
        setIsPaused(false);
      }
    }
  };

  useEffect(() => {
    if (sentences.length > 0 && !isPaused) {
      readCurrentSentence();
    }
  }, [isReading, currentSentenceIndex]);

  const readCurrentSentence = async () => {
    if (currentSentenceIndex < sentences.length) {
      // tách ra gọi api text to speech để có thời gian chờ cho api fpt xử lý
      if (nextAudioUrl) {
        setAudioUrl(nextAudioUrl);
        setNextAudioUrl("");
        setIsCurrentSentenceProcessed(true);// set để gọi useffect thôi
      } else {
        const currentSentence = sentences[currentSentenceIndex];
        let audioUrl = await textToSpeech(currentSentence);

        if (audioUrl) {
          setAudioUrl(`${audioUrl}?t=${new Date().getTime()}`);
          setIsCurrentSentenceProcessed(true);
        }
      }
    } else {
      await handleNextPageRead();
    }
  };

  const handleNextPageRead = async () => {
    if (rendition) {
      try {
        await rendition.next();
        await handleReadPage(); // trở lại set sentences
      } catch (error) {
        console.error("Error getting next page text:", error);
      }
    }
  };
  // gọi api text to speech cho câu tiếp
  useEffect(() => {
    if (
      isCurrentSentenceProcessed &&
      currentSentenceIndex + 1 < sentences.length
    ) {
      fetchNextAudioUrl();
    }
  }, [isCurrentSentenceProcessed]);

  const fetchNextAudioUrl = async () => {
    const nextSentence = sentences[currentSentenceIndex + 1];
    let nextAudioUrl = await textToSpeech(nextSentence);

    if (nextAudioUrl) {
      setNextAudioUrl(`${nextAudioUrl}?t=${new Date().getTime()}`);
    }
  };

  const [retryCount, setRetryCount] = useState(0);
  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.src = audioUrl;
      // audioRef.current.play().catch((error) => {
      //   console.error("Error playing audio:", error);
      // });
      const playAudio = async () => {
        try {
          audioRef.current.load();
          await audioRef.current.play();
          // Phát audio thành công, đặt lại số lần thử lại về 0
          setRetryCount(0);
        } catch (error) {
          console.error("Error playing audio:", error);
          // Nếu có lỗi khi phát audio, thử lại tối đa 60 lần, mỗi lần cách nhau 1s
          if (retryCount < 200) {
            setTimeout(playAudio, 1000);
            setRetryCount(prevCount => prevCount + 1);
          }
        }
      };
      playAudio();
    }
  }, [audioUrl]);

  const handleAudioEnded = async () => {
    if (currentSentenceIndex < sentences.length - 1) {
      setCurrentSentenceIndex((prevIndex) => prevIndex + 1);
    } else {
      await handleNextPageRead();
    }
  };

  const handleStopReading = () => {
    setIsReading(false);
    setIsPaused(false);
    if (audioRef.current) {
      audioRef.current.pause();
      setCurrentSentenceIndex(0);
    }
  };

  const handlePauseReading = () => {
    setIsPaused(true);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const handleResumeReading = () => {
    setIsPaused(false);
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("Error playing audio:", error);
        setIsPaused(true);
      });
    }
  };

  return (
    <>
      <div
        className={styles.readerContainer}
        style={{
          background: isDarkMode ? "#31363F" : "#EEEEEE",
          color: isDarkMode ? "#9CA3AF" : "#111827",
        }}
      >
        <div className={styles.settingContainer}>
          <div className={styles.noteList}>
            <Button onPress={onOpen}>Xem danh sách ghi chú</Button>
          </div>
          <Button onClick={handleReadPage}>Nghe từ đầu trang hiện tại</Button>
          <Button onClick={handlePauseReading}>Tạm dừng</Button>
          <Button onClick={handleResumeReading}>Tiếp tục</Button>
          <audio ref={audioRef} onEnded={handleAudioEnded} />
          <Button className={styles.chapterMenuButton} onPress={onOpenChapters}>
            Chapters
          </Button>
          <div className={styles.darkModeContainer}>
            <Switch
              isSelected={isDarkMode}
              onValueChange={() => {
                setIsDarkMode((p) => !p);
                setRendition(rendition);
              }}
            ></Switch>
            <span style={{ color: isDarkMode ? "#9CA3AF" : "#111827" }}>
              {" "}
              Dark Mode
            </span>
          </div>
        </div>

        <div className={styles.bookReaderContainer}>
          {!book ? (
            <Loading />
          ) : (
            <>
              <div className={styles.leftArrow} onClick={handlePreviousPage}>
                <FontAwesomeIcon
                  icon={faCaretLeft}
                  className={styles.icon}
                  width={70}
                  height={70}
                />
              </div>
              <div className={styles.rightArrow} onClick={handleNextPage}>
                <FontAwesomeIcon
                  icon={faCaretRight}
                  className={styles.icon}
                  width={70}
                  height={70}
                />
              </div>
              <EpubView
                className={styles.epubContainer}
                ref={epubViewRef}
                title={book.name}
                url={`${types.BACKEND_URL}/api/bookepub/${book.epub}`}
                location={location}
                locationChanged={(newPosition) => handlePageChange(newPosition)}
                getRendition={(rendition) => {
                  rendition.themes.register("custom", {
                    body: {
                      color: isDarkMode ? "#9CA3AF" : "#111827",
                      background: isDarkMode ? "#31363F" : "#EEEEEE",
                    },
                  });
                  rendition.themes.select("custom");
                  setRendition(rendition);
                }}
              // epubOptions={{ flow: 'scrolled ' }}
              />
            </>
          )}
        </div>
        {chapters.length > 0 && (
          <div
            className={styles.sliderContainer}
            style={{
              background: isDarkMode ? "#31363F" : "#EEEEEE",
              color: isDarkMode ? "#9CA3AF" : "#111827",
            }}
          >
            <Slider
              className={styles.sliderContent}
              label={chapters[selectedSliderChaper]?.label}
              hideValue={true}
              step={1}
              maxValue={chapters.length - 1}
              minValue={0}
              value={selectedSliderChaper}
              onChange={(val) => handleSliderChange(val)}
              classNames={{
                base: "max-w-md",
                filler: "bg-gradient-to-r from-primary-500 to-secondary-400",
                thumb: [
                  "transition-size",
                  "bg-gradient-to-r from-secondary-400 to-primary-500",
                  "data-[dragging=true]:shadow-lg data-[dragging=true]:shadow-black/20",
                  "data-[dragging=true]:w-7 data-[dragging=true]:h-7 data-[dragging=true]:after:h-6 data-[dragging=true]:after:w-6",
                ],
                step: "data-[in-range=true]:bg-black/30 dark:data-[in-range=true]:bg-white/50",
              }}
            />
          </div>
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
                Danh sách ghi chú
              </ModalHeader>
              <ModalBody>
                <div className=" bg-white min-h-[100px] p-2 rounded">
                  <ul className="grid grid-cols-1 divide-y  -mx-2 p-2">
                    {!isLoadingNote && selections.length === 0 ? (
                      <>Bạn chưa có ghi chú</>
                    ) : (
                      selections.map(
                        (note, i) => (
                          <li key={i} className="p-2">
                            <span style={{ backgroundColor: note.color }}>
                              {note.text}
                            </span>
                            <br />
                            <span>Ghi chú: {note.content}</span>
                            <br />
                            <button
                              className=" hover:no-underline text-sm mx-1"
                              onClick={() => {
                                rendition?.display(note.cfiRange);
                              }}
                            >
                              Show
                            </button>

                            <button
                              className=" hover:no-underline text-sm mx-1"
                              onClick={() => {
                                rendition?.annotations.remove(
                                  note.cfiRange,
                                  "highlight"
                                );
                                setSelections(
                                  selections.filter((item, j) => j !== i)
                                );
                                handleRemoveNote(note)
                              }}
                            >
                              Remove
                            </button>
                            <button
                              className=" hover:no-underline text-sm mx-1"
                              onClick={() => {
                                setSelectedNote(note)
                                setEditNoteInput(note.content)
                                onOpenEditNote()
                              }}
                            >
                              Edit
                            </button>
                          </li>
                        )
                      )
                    )}
                    {isLoadingNote &&
                      <>Loading...</>}
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
      </Modal >
      <Modal
        isOpen={isSelectionMenuOpen}
        onOpenChange={() => setSelectionMenuOpen(false)}
      >
        <ModalContent>
          <ModalBody>
            <div>
              <div className={styles.colorPicker}>
                Choose highlight color:
                {highlighters.map((option) => (
                  <div
                    key={option.value}
                    className={styles.colorOption}
                    style={{
                      backgroundColor: option.color,
                      borderRadius: "50%",
                      width:
                        selectedHighlighter == option.value ? "25px" : "20px",
                      height:
                        selectedHighlighter == option.value ? "25px" : "20px",
                      cursor: "pointer",
                      marginleft: "5px",
                      border:
                        selectedHighlighter == option.value
                          ? "2px solid red"
                          : "none",
                    }}
                    onClick={() =>
                      handleSelectHighlighter({
                        target: { value: option.value },
                      })
                    }
                  />
                ))}
              </div>
              <Textarea
                className={styles.colorPickerTextArea}
                placeholder="Enter your note here..."
                value={contentNote}
                onChange={(e) => setContentNote(e.target.value)}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button onPress={() => setSelectionMenuOpen(false)}>Close</Button>
            <Button onPress={handleSaveNote}>Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isOpenChapters} onOpenChange={onOpenChangeChapters}>
        <ModalContent>
          {(onCloseChapters) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Chapters
              </ModalHeader>
              <ModalBody>
                <div className={styles.chapterMenu}>
                  <ul>
                    {chapters.map((chapter, index) => (
                      <li key={index} onClick={() => handleSliderChange(index)}>
                        {chapter.label}
                      </li>
                    ))}
                  </ul>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={onCloseChapters}
                >
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal isOpen={isOpenEditNote} onOpenChange={onOpenChangeEditNote}>
        <ModalContent>
          {(onCloseChapters) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Edit note
              </ModalHeader>
              <ModalBody>
                <input type="text" value={editNoteInput} onChange={(e) => setEditNoteInput(e.target.value)} />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={onCloseEditNote}
                >
                  Close
                </Button>
                <Button
                  color="primary"
                  variant="light"
                  onPress={() => {
                    handleEditNote()
                    onCloseEditNote()
                    onClose()
                  }}
                >
                  Submit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Toaster />
    </>
  );
};

export default Reader;
