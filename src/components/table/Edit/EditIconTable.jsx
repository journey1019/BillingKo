import { useMemo, useState, lazy, Suspense } from 'react';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import { Box, Button, IconButton, Tooltip } from '@mui/material';
import { QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { fakeData, usStates } from './makeData.js';

const Example = () => {
    const [validationErrors, setValidationErrors] = useState({});

    const columns = useMemo(() => [
        { accessorKey: 'id', header: 'Id', enableEditing: false, size: 80 },
        {
            accessorKey: 'firstName',
            header: 'First Name',
            muiEditTextFieldProps: {
                required: true,
                error: !!validationErrors?.firstName,
                helperText: validationErrors?.firstName,
                onFocus: () => setValidationErrors({ ...validationErrors, firstName: undefined }),
            },
        },
        {
            accessorKey: 'lastName',
            header: 'Last Name',
            muiEditTextFieldProps: {
                required: true,
                error: !!validationErrors?.lastName,
                helperText: validationErrors?.lastName,
                onFocus: () => setValidationErrors({ ...validationErrors, lastName: undefined }),
            },
        },
        {
            accessorKey: 'email',
            header: 'Email',
            muiEditTextFieldProps: {
                type: 'email',
                required: true,
                error: !!validationErrors?.email,
                helperText: validationErrors?.email,
                onFocus: () => setValidationErrors({ ...validationErrors, email: undefined }),
            },
        },
        {
            accessorKey: 'state',
            header: 'State',
            editVariant: 'select',
            editSelectOptions: usStates,
            muiEditTextFieldProps: {
                select: true,
                error: !!validationErrors?.state,
                helperText: validationErrors?.state,
            },
        },
    ], [validationErrors]);

    const { mutateAsync: createUser } = useCreateUser();
    const { data: fetchedUsers = [], isLoading } = useGetUsers();
    const { mutateAsync: updateUser } = useUpdateUser();
    const { mutateAsync: deleteUser } = useDeleteUser();

    const handleCreateUser = async ({ values, table }) => {
        await createUser(values);
        table.setCreatingRow(null);
    };

    const handleSaveUser = async ({ values, table }) => {
        await updateUser(values);
        table.setEditingRow(null);
    };

    const openDeleteConfirmModal = (row) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            deleteUser(row.original.id);
        }
    };

    const table = useMaterialReactTable({
        columns,
        data: fetchedUsers,
        createDisplayMode: 'row',
        editDisplayMode: 'row',
        enableEditing: true,
        getRowId: (row) => row.id,
        onCreatingRowSave: handleCreateUser,
        onEditingRowSave: handleSaveUser,
        renderRowActions: ({ row, table }) => (
            <Box sx={{ display: 'flex', gap: '1rem' }}>
                <Tooltip title="Edit">
                    <IconButton onClick={() => table.setEditingRow(row)}>
                        <EditIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                    <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            </Box>
        ),
        // renderTopToolbarCustomActions: ({ table }) => (
        //     <Button variant="contained" onClick={() => table.setCreatingRow(true)}>
        //         Create New User
        //     </Button>
        // ),
        state: { isLoading },
    });

    return <MaterialReactTable table={table} />;
};

function useCreateUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (user) => {
            await new Promise(resolve => setTimeout(resolve, 1000));
        },
        onMutate: (newUserInfo) => {
            queryClient.setQueryData(['users'], (prev) => [...prev, newUserInfo]);
        }
    });
}

function useGetUsers() {
    return useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            return Promise.resolve(fakeData);
        },
    });
}

function useUpdateUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (user) => {
            await new Promise(resolve => setTimeout(resolve, 1000));
        },
        onMutate: (newUserInfo) => {
            queryClient.setQueryData(['users'], (prev) => prev.map((u) => (u.id === newUserInfo.id ? newUserInfo : u)));
        }
    });
}

function useDeleteUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (userId) => {
            await new Promise(resolve => setTimeout(resolve, 1000));
        },
        onMutate: (userId) => {
            queryClient.setQueryData(['users'], (prev) => prev.filter((u) => u.id !== userId));
        }
    });
}

const queryClient = new QueryClient();

export default function EditIconTable() {
    return (
        <QueryClientProvider client={queryClient}>
            <Example />
        </QueryClientProvider>
    );
}