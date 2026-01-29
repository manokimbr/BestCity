import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Card,
    CardContent,
    CardActions,
    Grid,
    Box,
    Alert,
    Snackbar,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import axios from 'axios';

interface Note {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}

interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
    count?: number;
}

const NotesDemo: React.FC = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [editingNote, setEditingNote] = useState<Note | null>(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [searchId, setSearchId] = useState('');
    const [searchResult, setSearchResult] = useState<Note | null>(null);
    const [showSearchResult, setShowSearchResult] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    const API_URL = '/api/notes';

    // Fetch all notes
    const fetchNotes = async () => {
        try {
            const response = await axios.get<ApiResponse<Note[]>>(API_URL);
            if (response.data.success && response.data.data) {
                setNotes(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching notes:', error);
            showSnackbar('Failed to fetch notes', 'error');
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    const showSnackbar = (message: string, severity: 'success' | 'error' = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    // Create new note
    const handleCreateNote = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            showSnackbar('Title and content are required', 'error');
            return;
        }

        try {
            const response = await axios.post<ApiResponse<Note>>(API_URL, { title, content });
            if (response.data.success) {
                showSnackbar('Note created successfully!');
                setTitle('');
                setContent('');
                fetchNotes();
            }
        } catch (error: any) {
            console.error('Error creating note:', error);
            showSnackbar(error.response?.data?.message || 'Failed to create note', 'error');
        }
    };

    // Delete note
    const handleDeleteNote = async (id: number) => {
        try {
            const response = await axios.delete<ApiResponse<Note>>(`${API_URL}/${id}`);
            if (response.data.success) {
                showSnackbar('Note deleted successfully!');
                fetchNotes();
            }
        } catch (error: any) {
            console.error('Error deleting note:', error);
            showSnackbar(error.response?.data?.message || 'Failed to delete note', 'error');
        }
    };

    // Open edit dialog
    const handleEditClick = (note: Note) => {
        setEditingNote({ ...note });
        setEditDialogOpen(true);
    };

    // Update note
    const handleUpdateNote = async () => {
        if (!editingNote) return;

        try {
            const response = await axios.put<ApiResponse<Note>>(
                `${API_URL}/${editingNote.id}`,
                { title: editingNote.title, content: editingNote.content }
            );
            if (response.data.success) {
                showSnackbar('Note updated successfully!');
                setEditDialogOpen(false);
                setEditingNote(null);
                fetchNotes();
            }
        } catch (error: any) {
            console.error('Error updating note:', error);
            showSnackbar(error.response?.data?.message || 'Failed to update note', 'error');
        }
    };

    // Search note by ID
    const handleSearchById = async () => {
        if (!searchId.trim()) {
            showSnackbar('Please enter a note ID', 'error');
            return;
        }

        try {
            const response = await axios.get<ApiResponse<Note>>(`${API_URL}/${searchId}`);
            if (response.data.success && response.data.data) {
                setSearchResult(response.data.data);
                setShowSearchResult(true);
                showSnackbar('Note found!');
            }
        } catch (error: any) {
            console.error('Error searching note:', error);
            setSearchResult(null);
            setShowSearchResult(true);
            showSnackbar(error.response?.data?.message || `Note with ID ${searchId} not found`, 'error');
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold' }}>
                📝 Notes API Demo
            </Typography>

            {/* Create Note Form */}
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Create New Note
                </Typography>
                <Box component="form" onSubmit={handleCreateNote}>
                    <TextField
                        fullWidth
                        label="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        margin="normal"
                        multiline
                        rows={4}
                        required
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        sx={{ mt: 2 }}
                    >
                        Create Note
                    </Button>
                </Box>
            </Paper>

            {/* Search Note by ID */}
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Search Note by ID
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    <TextField
                        label="Note ID"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        type="number"
                        sx={{ width: 200 }}
                    />
                    <Button
                        variant="contained"
                        color="secondary"
                        size="large"
                        onClick={handleSearchById}
                    >
                        Search
                    </Button>
                </Box>

                {/* Search Result */}
                {showSearchResult && (
                    <Box sx={{ mt: 3 }}>
                        {searchResult ? (
                            <Card elevation={2}>
                                <CardContent>
                                    <Typography variant="h6" component="h2" gutterBottom color="primary">
                                        ✓ Note Found (ID: {searchResult.id})
                                    </Typography>
                                    <Typography variant="h6" component="h3" sx={{ mt: 1 }}>
                                        {searchResult.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" paragraph sx={{ mt: 1 }}>
                                        {searchResult.content}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" display="block">
                                        Created: {formatDate(searchResult.createdAt)}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" display="block">
                                        Updated: {formatDate(searchResult.updatedAt)}
                                    </Typography>
                                </CardContent>
                            </Card>
                        ) : (
                            <Alert severity="error">
                                Note with ID {searchId} not found
                            </Alert>
                        )}
                    </Box>
                )}
            </Paper>

            {/* Notes List */}
            <Typography variant="h5" gutterBottom>
                All Notes ({notes.length})
            </Typography>

            {notes.length === 0 ? (
                <Alert severity="info" sx={{ mt: 2 }}>
                    No notes yet. Create your first note above!
                </Alert>
            ) : (
                <Grid container spacing={3}>
                    {notes.map((note) => (
                        <Grid item xs={12} sm={6} md={4} key={note.id}>
                            <Card elevation={2}>
                                <CardContent>
                                    <Typography variant="h6" component="h2" gutterBottom>
                                        {note.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" paragraph>
                                        {note.content}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" display="block">
                                        Created: {formatDate(note.createdAt)}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" display="block">
                                        Updated: {formatDate(note.updatedAt)}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <IconButton
                                        size="small"
                                        color="primary"
                                        onClick={() => handleEditClick(note)}
                                        title="Edit note"
                                    >
                                        <Edit />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => handleDeleteNote(note.id)}
                                        title="Delete note"
                                    >
                                        <Delete />
                                    </IconButton>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Edit Dialog */}
            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Edit Note</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Title"
                        value={editingNote?.title || ''}
                        onChange={(e) => setEditingNote(editingNote ? { ...editingNote, title: e.target.value } : null)}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Content"
                        value={editingNote?.content || ''}
                        onChange={(e) => setEditingNote(editingNote ? { ...editingNote, content: e.target.value } : null)}
                        margin="normal"
                        multiline
                        rows={4}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleUpdateNote} variant="contained" color="primary">
                        Update
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default NotesDemo;
