"use client"
import Footer from '@/components/Footer/Footer'
import Header from '@/components/Header/Header'
import React, { useMemo } from 'react'
import styles from '../ranking.module.scss'
import Link from 'next/link'
import {
  Button, DropdownTrigger, Table,
  TableHeader, TableColumn, TableBody, TableRow, TableCell, Dropdown,
  DropdownMenu, DropdownItem, Spinner, Pagination, getKeyValue
} from "@nextui-org/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark, faCoffee, faTrashCan, faXmark } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import useSWR from 'swr'

const Ranking = () => {
  const [selectedKeys, setSelectedKeys] = useState(new Set(["Ngày"]));

  const selectedValue = useMemo(
    () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
    [selectedKeys]
  );

  // for table
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const [page, setPage] = useState(1);

  const { data, isLoading } = useSWR(`https://swapi.py4e.com/api/people?page=${page}`, fetcher, {
    keepPreviousData: true,
  });

  const rowsPerPage = 10;

  const pages = useMemo(() => {
    return data?.count ? Math.ceil(data.count / rowsPerPage) : 0;
  }, [data?.count, rowsPerPage]);

  const loadingState = isLoading || data?.results.length === 0 ? "loading" : "idle";

  // end for table
  return (
    <div className={styles.rankingContainer}>
      <Header />
      <div className={styles.rankingContent}>
        <div className={styles.wrapper}>
          <div className={styles.header}>
            <div className={styles.headerTitle}>
              Bảng xếp hạng
            </div>
            <div className={styles.navWrapper}>
              <div className={styles.nav}>
                <Link href={'/ranking/book'}>
                  <div className={styles.navItem}>
                    Sách
                  </div>
                </Link>
                <Link href={'/ranking/audio-book'}>
                  <div className={styles.navItem}>
                    Sách nói
                  </div>
                </Link>
              </div>
              <div className={styles.rankingDropdown}>
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      color="primary"
                      variant="flat"
                    >
                      {selectedValue}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Static Actions" variant="flat"
                    disallowEmptySelection
                    selectionMode="single"
                    selectedKeys={selectedKeys}
                    onSelectionChange={setSelectedKeys}>
                    <DropdownItem key="Ngày">Ngày</DropdownItem>
                    <DropdownItem key="Tuần">Tuần</DropdownItem>
                    <DropdownItem key="Tháng">Tháng</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>

            </div>
            <div className={styles.rankingTable}>
              <Table
                hideHeader
                bottomContent={
                  pages > 0 ? (
                    <div className="flex w-full justify-center">
                      <Pagination
                        isCompact
                        showControls
                        showShadow
                        color="primary"
                        page={page}
                        total={pages}
                        onChange={(page) => setPage(page)}
                      />
                    </div>
                  ) : null
                }
              // {...args}
              >
                <TableHeader>
                  <TableColumn key="name"></TableColumn>
                  <TableColumn key="height"></TableColumn>
                  <TableColumn key="mass"></TableColumn>
                  <TableColumn key="birth_year"></TableColumn>
                </TableHeader>
                <TableBody
                  items={data?.results ?? []}
                  loadingContent={<Spinner />}
                  loadingState={loadingState}
                >
                  {(item) => (
                    <TableRow key={item?.name}>
                      {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Ranking
