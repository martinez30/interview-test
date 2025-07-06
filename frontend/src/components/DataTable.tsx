import React, { ReactNode, useCallback, useEffect, useState } from "react";
import { Column, TableInstance, Row as RowType, usePagination, useTable, useGlobalFilter, Cell, useRowSelect } from "react-table";
import { Button, Card, Col, Form, Pagination as PaginationComponent, Row, Table } from "react-bootstrap";
import { useSuspenseQuery } from "@tanstack/react-query";
import Loader from "./Loader";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import "@/styles/components/datatable.scss"
import { TextFormField, TextFormFieldProps } from "./form/TextFormField/TextFormField";
import { BaseFilter } from "@/types/api/filters/BaseFilter";
import { PagedList } from "@/types/api/PagedList";
import { toastr } from "@/utils/toastr";
import { errorHandling } from "@/utils/errorHandling";
import { SpeedDial, SpeedDialAction } from "@mui/material";
import { SlOptionsVertical } from "react-icons/sl";

export interface GlobalFilterType {
    name: string,
    value: unknown
}

interface RowSelectionProps<T extends {}> {
    label: string,
    handle: (selectedItems: T[]) => Promise<void>
    icon: ReactNode
}

interface DataTableProps<T extends {}, TFilter> {
    title?: string,
    description?: string,
    thin?: boolean,
    columns: Column<T>[],
    queryName?: string | (string | Date | undefined)[],
    query: (filters: GlobalFilterType[], pagination: { limit: number, offset: number }, signal?: AbortSignal) => Promise<PagedList<T>>,
    createRouterLink?: string
    hover?: boolean,
    filters?: TextFormFieldProps<TFilter>[];
    summary?: ReactNode;
    reloadButton?: boolean,
    autoReloadTimerInSeconds?: number,
    fetchButton?: boolean,
    fetchButtonVariant?: string,
    fetchButtonName?: string,
    cleanButton?: boolean,
    exportButton?: boolean,
    exportButtonText?: string,
    hidePagination?: boolean;
    fixedPageSize?: number;
    showRegisterCount?: boolean;
    hideTotalPages?: boolean;
    defaultPaginationConfig?: { pageIndex?: number, pageSize?: number }
    rowSelectionProps?: RowSelectionProps<T>[],
    rowSelectionShowIfFn?: (row: T) => boolean,
    exportFn?: (filters: any[]) => Promise<{ url: string }>;
    cleanFn?: () => Promise<void>;
}

const IndeterminateCheckbox = React.forwardRef(
    //@ts-ignore
    ({ indeterminate, ...rest }, ref) => {
        const defaultRef = React.useRef()
        const resolvedRef = ref || defaultRef

        React.useEffect(() => {
            //@ts-ignore
            resolvedRef.current.indeterminate = indeterminate
        }, [resolvedRef, indeterminate])

        return (
            //@ts-ignore
            <> <input type="checkbox" ref={resolvedRef} {...rest} /> </>
        )
    }
)

const DataTable = <T extends {}, TFilter extends BaseFilter = BaseFilter>(props: DataTableProps<T, TFilter>) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [globalFilters, setGlobalFilters] = useState<GlobalFilterType[]>(searchParams.size > 0 ? [...searchParams.entries()].filter(item => item[1]).map(([name, value]) => ({ name, value })) : []);

    const [{ pageIndex, pageSize }, setPagination] = useState({ pageIndex: props.defaultPaginationConfig?.pageIndex ?? 1, pageSize: props.defaultPaginationConfig?.pageSize ?? 10 })
    const [pageCount, setPageCount] = useState(1)
    const [registerCount, setRgisterCount] = useState(0)
    const [exportLoading, setExportLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const queryAsync = useCallback(async (globalFilters: GlobalFilterType[], pagination: { limit: number, offset: number }, signal?: AbortSignal) => {
        let response = await props.query(globalFilters, pagination);
        setPageCount(response?.totalPages ?? 1);
        setTimeout(() => { setRgisterCount(response?.totalCount ?? 0) }, 100);

        return response;
    }, [globalFilters, pageIndex, pageSize])

    const queryKey = [props.queryName
        ? Array.isArray(props.queryName)
            ? [...props.queryName]
            : props.queryName
        : "default-query-name", { globalFilters, pageIndex, pageSize } as any];

    const handleChangeGlobalFilter = (name: string, value: unknown) => {
        const filters = [...globalFilters];
        const index = filters.findIndex(f => f.name === name);
        if (index > -1) {
            filters[index].value = value;
        }
        else {
            filters.push({ name, value });
        }
        setGlobalFilters(filters);
        setRgisterCount(0)
        const urlSearchParams = filters
            .filter(item => !!item.value)
            .reduce((acc, curr) => {
                acc[curr.name] = `${curr.value}`;
                return acc;
            }, {} as any);

        setSearchParams(`?${new URLSearchParams(urlSearchParams)}`)
    }

    const { isLoading, isRefetching, refetch, data } = useSuspenseQuery({
        queryKey: queryKey,
        meta: { fetchFn: async () => await queryAsync(globalFilters, { limit: pageSize, offset: (pageIndex - 1) * pageSize }) },
        initialData: props.fetchButton ? { values: [], currentPage: 1, pageSize: 10, totalCount: 0, totalPages: 1, hasNextPage: false, hasPreviousPage: false } as PagedList<T> : undefined
    });

    async function movePageCallback(pageIndex: number, pageSize: number) {
        setPagination({ pageIndex, pageSize })
        setTimeout(async () => await refetch(), 10);
    }
    if (props.reloadButton && props.autoReloadTimerInSeconds) {
        useEffect(() => {
            if (props.autoReloadTimerInSeconds && props.autoReloadTimerInSeconds > 0) {
                const interval = setInterval(async () => { await refetch() }, props.autoReloadTimerInSeconds * 1000);
                return () => clearInterval(interval);
            }
        }, [props.autoReloadTimerInSeconds]);
    }



    const { selectedFlatRows, ...tableProps } = useTable<T>(
        {
            columns: props.columns as Column<T>[],
            data: data?.values ?? [],
            initialState: { pageIndex: 1, pageSize: data?.pageSize },
            pageCount: data?.totalPages,
            manualFilters: true,
            manualPagination: true
        },
        useGlobalFilter,
        usePagination,
        useRowSelect,
        hooks => {
            props.rowSelectionProps && props.rowSelectionProps.length > 0 &&
                hooks.visibleColumns.push(columns => [
                    {
                        id: 'selection',
                        Header: ({ getToggleAllRowsSelectedProps }) => (
                            //@ts-ignore
                            <div> <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} /> </div>
                        ),
                        //@ts-ignore
                        Cell: ({ row }) => {
                            if (!props.rowSelectionShowIfFn || props.rowSelectionShowIfFn(row.original)) {
                                return (
                                    <>
                                        <div>
                                            <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
                                        </div>
                                    </>
                                )
                            }
                            return (<></>)
                        },

                    },
                    ...columns,
                ])
        }
    );


    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
    } = tableProps;

    return (
        <>
            {
                props.createRouterLink &&
                <Row style={{ justifyContent: "end", margin: "10px 0" }}>
                    <Link to={props.createRouterLink}>
                        <Button style={{ maxWidth: "fit-content", float: "right" }}>Adicionar</Button>
                    </Link>
                </Row>
            }
            <Card style={{ boxShadow: "none" }}>
                {(props.title || props.description) && (
                    <Card.Header>
                        {props.title && <Card.Title>{props.title}</Card.Title>}
                        {props.description && <h6 className="card-subtitle text-muted">{props.description}</h6>}
                    </Card.Header>
                )}
                {props.filters && props.filters.filter(item => item.renderIf !== false) && (
                    <Row className="datatable-filters">
                        {props.filters
                            .filter(item => item.renderIf !== false)
                            .map((filter, key) => {
                                return (
                                    <Col md={3} key={key}>
                                        <TextFormField
                                            {...filter}
                                            defaultValue={searchParams.get(filter.name.toString()) ?? filter.defaultValue}
                                            value={globalFilters.find(f => f.name === filter.name)?.value as any ?? null}
                                            handleChange={(event) => {
                                                if (event.hasOwnProperty("target")) {
                                                    handleChangeGlobalFilter(event.target.name, event.target.value)
                                                }
                                                else {
                                                    handleChangeGlobalFilter(event.name, event.value)
                                                }
                                            }}
                                        />
                                    </Col>
                                )
                            })}
                    </Row>
                )}
                {props.filters && (props.cleanButton || props.fetchButton || props.exportButton || props.reloadButton) && (
                    <div style={{ display: "flex", justifyContent: "flex-end", paddingBottom: 15, paddingRight: 20, gap: 10 }}>
                        {props.exportButton && <Button variant="success" onClick={async () => {
                            if (props.exportFn) {

                                try {
                                    setExportLoading(true);

                                    let filters = Array.from(searchParams.entries()).map(([key, value]) => ({
                                        name: key,
                                        value: value
                                    }));

                                    const response = await props.exportFn(filters);
                                    const link = document.createElement('a');
                                    link.href = response.url;
                                    document.body.appendChild(link);
                                    link.click();
                                    link.parentNode?.removeChild(link);
                                    toastr({ icon: 'success', title: 'Exportação realizada com sucesso!' })
                                }
                                catch (error) {
                                    errorHandling(error)
                                }
                                finally {
                                    setExportLoading(false)
                                }
                            }
                            else {
                                toastr({ icon: 'error', title: 'Exportação não implementada!' })

                            }
                        }} disabled={exportLoading} >{exportLoading ? "Exportando..." : props.exportButtonText ?? "Exportar"} </Button>}
                        {props.cleanButton && <Button variant="secondary" onClick={() => {
                            setGlobalFilters([]);
                            setSearchParams("");
                            setRgisterCount(0);
                            if (props.cleanFn)
                                props.cleanFn();
                        }}>Limpar</Button>}
                        {props.fetchButton && <Button className={"fetchButton"} variant={props.fetchButtonVariant} onClick={() => refetch()}>{props.fetchButtonName ?? "Buscar"}</Button>}
                        {props.reloadButton && <Button className={"reloadButton"} onClick={() => refetch()}>Atualizar {props.autoReloadTimerInSeconds ? `(${props.autoReloadTimerInSeconds}s)` : ""}</Button>}
                    </div>
                )}
                {props.summary}
                <Table style={{ maxWidth: "100%", overflowX: "auto", whiteSpace: "nowrap" }} responsive bordered striped hover={props.hover ?? true} {...getTableProps()} {...(props.thin ? { size: 'sm' } : {})}>
                    <thead>
                        {headerGroups.map((headerGroup, index) => (
                            <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                                {headerGroup.headers.map((column, columnIndex) => (
                                    <th {...column.getHeaderProps(
                                    )} key={columnIndex}>
                                        {column.render("Header")}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {(isLoading || isRefetching)
                            ? (
                                <tr>
                                    <td colSpan={props.rowSelectionProps ? props.columns.length + 1 : props.columns.length}>
                                        <Loader small />
                                    </td>
                                </tr>
                            )
                            : page.length === 0 ? (
                                <tr>
                                    <td colSpan={props.rowSelectionProps ? props.columns.length + 1 : props.columns.length} style={{ textAlign: "center" }}>Nenhum registro encontrado</td>
                                </tr>
                            ) : page.map((row: RowType<any>, index: number) => {
                                prepareRow(row);
                                return (
                                    <tr {...row.getRowProps()} key={index}>
                                        {row.cells.map((cell: Cell<object>, cellIndex) => {
                                            return (
                                                <td {...cell.getCellProps()} key={cellIndex}>{cell.render("Cell")}</td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                    </tbody>
                </Table>

                {!props.hidePagination && <Pagination fixedPageSize={props.fixedPageSize} tableProps={{ selectedFlatRows, ...tableProps }} refetch={movePageCallback} pageIndex={pageIndex} pageSize={pageSize} pageCountState={pageCount} registerCount={registerCount} showRegisterCount={props.showRegisterCount} hideTotalPages={props.hideTotalPages} />}
            </Card>
            {props.rowSelectionProps
                && props.rowSelectionProps.length > 0
                && selectedFlatRows
                && selectedFlatRows.length > 0
                && <SelectRowActions actions={props.rowSelectionProps} selectedIds={selectedFlatRows.map(row => (row.original as any))} />
            }
        </>
    )
}

const SelectRowActions = ({ actions, selectedIds }: { actions: RowSelectionProps<any>[], selectedIds: string[] }) => {
    return (
        <SpeedDial
            ariaLabel="Row Selection"
            sx={{ position: "fixed", bottom: "1.5rem", right: "1.5rem" }}
            icon={<SlOptionsVertical size={20} />}
            FabProps={{
                sx: {
                    bgcolor: '#4F46E5',
                    '&:hover': {
                        bgcolor: '#4F46E5',
                    }
                }
            }}
        >
            {actions.map((action, index) => <SpeedDialAction
                tooltipOpen
                style={{ whiteSpace: "nowrap" }}
                key={index}
                icon={action.icon}
                tooltipTitle={action.label}
                onClick={() => { action.handle(selectedIds) }}
            />)}


        </SpeedDial>
    );
}

const Pagination = ({ tableProps, fixedPageSize, refetch, pageIndex, pageSize, pageCountState, registerCount, showRegisterCount, hideTotalPages }: { tableProps: TableInstance<any>, fixedPageSize?: number, refetch: any, pageIndex: number, pageSize: number, pageCountState: number, registerCount: number, showRegisterCount?: boolean, hideTotalPages?: boolean }) => {
    const {
        canPreviousPage,
        canNextPage,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        pageCount
    } = tableProps;

    let totalPages = pageCountState;
    if (pageCount > pageCountState)
        totalPages = pageCount;

    return (
        <Row style={{ margin: "20px 10px 0", justifyContent: 'space-between' }}>
            <Row style={{ width: 'fit-content', height: 'fit-content', alignItems: 'center' }}>
                <span className="mx-2" style={{ width: 'fit-content' }}>
                    Página{" "}
                    <strong>
                        {hideTotalPages ?
                            <>
                                {pageIndex}
                            </>
                            :
                            <>
                                {pageIndex} de {totalPages}
                            </>
                        }
                    </strong>
                    {showRegisterCount && <><br />({registerCount} registros)</>}

                </span>
                {!fixedPageSize ? (
                    <>
                        <span className="ms-3 me-2" style={{ width: 'fit-content' }}>Itens por página:</span>
                        <Form.Select
                            className="d-inline-block w-auto"
                            style={{ width: 'fit-content' }}
                            value={pageSize}
                            onChange={async (e: any) => {
                                setPageSize(Number(e.target.value));
                                await refetch(pageIndex, Number(e.target.value));
                            }}
                        >
                            {[5, 10, 25, 50, 100].map((pageSize) => (
                                <option key={pageSize} value={pageSize}>
                                    {pageSize}
                                </option>
                            ))}
                        </Form.Select>
                    </>
                ) : <span style={{ width: 'fit-content' }}>Itens por página: {fixedPageSize}</span>}
            </Row>
            <PaginationComponent style={{ width: 'fit-content' }}>
                <PaginationComponent.First
                    onClick={async () => {
                        gotoPage(1)
                        await refetch(1, pageSize);
                    }}
                    disabled={pageIndex === 1}
                />
                <PaginationComponent.Prev
                    onClick={async () => {
                        previousPage()
                        await refetch(pageIndex - 1, pageSize);

                    }}
                    disabled={pageIndex === 1}
                />
                <PaginationComponent.Next
                    onClick={async () => {
                        nextPage()
                        await refetch(pageIndex + 1, pageSize);
                    }}
                    disabled={pageIndex === totalPages}
                />
                <PaginationComponent.Last
                    onClick={async () => {
                        gotoPage(totalPages - 1)
                        await refetch(totalPages, pageSize);
                    }}
                    disabled={pageIndex === totalPages}
                />
            </PaginationComponent>
        </Row>
    );
}

export default DataTable;
export { IndeterminateCheckbox, SelectRowActions };
export type DataTableType = typeof DataTable;