import React, { useEffect, useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, Divider, RadioGroup, Radio, Input, Button } from "@nextui-org/react";
import styles from './CreateReadingGoal.module.scss'

const EditReadingGoalModal = (props) => {
  const [selectedTimeFrame, setSelectedTimeFrame] = useState("")
  const [selectedGoalType, setSelectedGoalType] = useState("")
  const [goalAmount, setGoalAmount] = useState(1)


  useEffect(() => {
    if (props.goal) {
      setSelectedTimeFrame(props.goal.timeFrame)
      setSelectedGoalType(props.goal.goalType)
      setGoalAmount(props.goal.goalAmount)
    }
  }, [props.goal])
  return (
    <Modal isOpen={props.isOpen} onOpenChange={props.onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Chỉnh sửa mục tiêu đọc sách</ModalHeader>
            <Divider />
            <ModalBody>
              <RadioGroup
                label="Bạn muốn hoàn thành mục tiêu theo:"
                value={selectedTimeFrame}
                onValueChange={setSelectedTimeFrame}
              >
                <Radio value="day">Theo ngày</Radio>
                <Radio value="week">Theo tuần</Radio>
                <Radio value="month">Theo tháng</Radio>
                <Radio value="year">Theo năm</Radio>
              </RadioGroup>
              <RadioGroup
                label="Đặt mục tiêu dựa trên:"
                value={selectedGoalType}
                onValueChange={setSelectedGoalType}
              >
                <Radio value="pages">Số trang sách đã đọc</Radio>
                <Radio value="books">Số quyển sách đã đọc</Radio>
              </RadioGroup>
              <Input
                className={styles.amountInput}
                type="number"
                label="Số lượng cần thực hiện"
                labelPlacement="outside-left"
                description="VD: 3 trang sách, 4 quyển sách.."
                value={goalAmount}
                onChange={(e) => setGoalAmount(e.target.value)} />
              <Button color="primary" className={styles.submitBtn} onPress={() => props.editReadingGoal({
                goalType: selectedGoalType,
                goalAmount: goalAmount,
                timeFrame: selectedTimeFrame,
              })}>Lưu</Button>
            </ModalBody>

          </>
        )}
      </ModalContent>
    </Modal >
  )
}

export default EditReadingGoalModal
