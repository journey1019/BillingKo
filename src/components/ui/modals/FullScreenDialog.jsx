import React from 'react';
import {
    Dialog,
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Slide,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

/**
 * FullScreenDialog
 * @param open (boolean): 다이얼로그 열림 여부
 * @param onClose (function): 닫기 핸들러
 * @param title (string): 헤더 제목
 * @param children (ReactNode): 본문 컨텐츠
 */
const FullScreenDialog = ({ open, onClose, title = "상세 보기", children }) => {
    return (
        <Dialog
            fullScreen
            open={open}
            onClose={onClose}
            TransitionComponent={Transition}
        >
            <AppBar sx={{ position: 'relative', bgcolor: '#1e293b' }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        {title}
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* 본문 */}
            <div className="p-4 overflow-auto h-full">{children}</div>
        </Dialog>
    );
};

export default FullScreenDialog;
