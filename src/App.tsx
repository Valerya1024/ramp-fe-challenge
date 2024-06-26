import { Fragment, useCallback, useEffect, useMemo, useState } from "react"
import { InputSelect } from "./components/InputSelect"
import { Instructions } from "./components/Instructions"
import { Transactions } from "./components/Transactions"
import { useEmployees } from "./hooks/useEmployees"
import { usePaginatedTransactions } from "./hooks/usePaginatedTransactions"
import { useTransactionsByEmployee } from "./hooks/useTransactionsByEmployee"
import { EMPTY_EMPLOYEE } from "./utils/constants"
import { Employee } from "./utils/types"
import classNames from "classnames"

export function App() {
  const { data: employees, ...employeeUtils } = useEmployees()
  const { data: paginatedTransactions, ...paginatedTransactionsUtils } = usePaginatedTransactions()
  const { data: transactionsByEmployee, ...transactionsByEmployeeUtils } = useTransactionsByEmployee()
  //const [isLoading, setIsLoading] = useState(false)
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false)
  const [hidesNextButton, setHidesNextButton] = useState(false)

  var transactions = useMemo(() => {
    console.log(paginatedTransactions?.data)
    console.log(transactionsByEmployee)
    return paginatedTransactions?.data ?? transactionsByEmployee ?? null
  }, [paginatedTransactions, transactionsByEmployee])

  const loadAllEmployees = useCallback(async () => {
    setIsLoadingEmployees(true)

    await employeeUtils.fetchAll()

    setIsLoadingEmployees(false)
  }, [employeeUtils])

  const loadAllTransactions = useCallback(async () => {
    //setIsLoading(true)

    transactionsByEmployeeUtils.invalidateData()
    await paginatedTransactionsUtils.fetchAll()

    //setIsLoading(false)
  }, [paginatedTransactionsUtils, transactionsByEmployeeUtils])

  const loadTransactionsByEmployee = useCallback(
    async (employeeId: string) => {
      paginatedTransactionsUtils.invalidateData()
      transactionsByEmployeeUtils.invalidateData()
      await transactionsByEmployeeUtils.fetchById(employeeId)
    },
    [paginatedTransactionsUtils, transactionsByEmployeeUtils]
  )

  useEffect(() => {
    if (employees === null && !employeeUtils.loading) {
      loadAllEmployees()
      loadAllTransactions()
    }
  }, [employeeUtils.loading, employees, loadAllTransactions, loadAllEmployees])

  return (
    <Fragment>
      <main className="MainContainer">
        <Instructions />

        <hr className="RampBreak--l" />

        <InputSelect<Employee>
          isLoading={isLoadingEmployees}
          defaultValue={EMPTY_EMPLOYEE}
          items={employees === null ? [] : [EMPTY_EMPLOYEE, ...employees]}
          label="Filter by employee"
          loadingLabel="Loading employees"
          parseItem={(item) => ({
            value: item.id,
            label: `${item.firstName} ${item.lastName}`,
          })}
          onChange={async (newValue) => {
            if (newValue === null) {
              return
            }
            //console.log({ newValue })
            if (newValue.id === "") {
              setHidesNextButton(false)
              await loadAllTransactions()
              return
            }
            setHidesNextButton(true)
            await loadTransactionsByEmployee(newValue.id)
          }}
        />

        <div className="RampBreak--l" />

        <div className="RampGrid">
          <Transactions transactions={transactions} />

          {transactions !== null && (
            <button
              className={classNames("RampButton", {
                "RampButton--hide": paginatedTransactions?.nextPage === null || hidesNextButton,
              })}
              disabled={paginatedTransactionsUtils.loading}
              onClick={async () => {
                await loadAllTransactions()
              }}
            >
              View More
            </button>
          )}
        </div>
      </main>
    </Fragment>
  )
}
