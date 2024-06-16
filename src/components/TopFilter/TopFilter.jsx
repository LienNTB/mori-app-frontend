import styles from "./TopFilter.module.scss";
import { Dropdown, Menu, ModalBody, ModalHeader, Spacer } from "@nextui-org/react";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal, Button, Text, Input, Row, Checkbox } from "@nextui-org/react";
import { useState } from "react";

function TopFilter({ brandList, isChecked, handleChange, isCheckedFilter }) {
  const menuItems = [
    { name: "Tên A → Z", filterName: "ascName" },
    { name: "Tên Z → A", filterName: "descName" },
    { name: "Giá giảm dần", filterName: "descPrice" },
    { name: "Giá tăng dần", filterName: "ascPrice" },
  ];

  const [selected, setSelected] = useState("Sắp xếp");
  const [visible, setVisible] = useState(false);
  const handler = () => { setVisible(true); };
  const closeHandler = () => {
    setVisible(false);
  };

  const handleSelected = (e) => {
    let filterType = menuItems.filter((item) => {
      if (item.name === e.currentKey) {
        return item.filterName;
      }
    });

    handleChange(filterType[0].filterName.toString());
  };

  return (
    <div className={styles.topFilterContainer}>

      <div className={styles.topFilterLeft}>
        <Dropdown>
          <Button color="success" flat>
            {selected}
          </Button>
          <Menu
            aria-label="Single selection actions"
            color="secondary"
            items={menuItems}
            disallowEmptySelection
            selectionMode="single"
            selectedKeys={selected.name}
            onSelectionChange={handleSelected}
          >
            {(item) => (
              <Item key={item.name} color="success">
                {item.name}
              </Item>
            )}
            hihi
          </Menu>
        </Dropdown>
      </div>
      <div className={styles.topFilterRight} onClick={handler}>
        <FontAwesomeIcon icon={faFilter} /> Lọc
      </div>
      <Modal
        scroll
        width="700px"
        closeButton
        aria-labelledby="modal-title"
        open={visible}
        onClose={closeHandler}
      >
        <Modal.Header>
          <Text id="modal-title" size={20} h1 weight="bold">
            Tìm theo:
          </Text>
        </Modal.Header>
        <Modal.Body h2 weight="bold" size={15}>
          {/* <div>
            <Text color="green" weight="bold" size={15}>
              THỂ LOẠI            </Text>
            {brandList.map((brand, index) => {
              return (
                <>
                  <Checkbox
                    color="success"
                    defaultSelected={isChecked(brand)}
                    name="brand"
                    value={brand}
                    onChange={() => handleChange(brand)}
                  >
                    {brand}
                  </Checkbox>
                  <Spacer />
                </>
              );
            })}
          </div> */}
          hihi
          <div>
            <Text color="green" weight="bold" size={15}>
              LOẠI SẢN PHẨM
            </Text>
            <Checkbox size="sm" color="success">
              Đồ gia dụng
            </Checkbox>
            <Spacer />
            <Checkbox size="sm" color="success">
              Thời trang xanh
            </Checkbox>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default TopFilter;
