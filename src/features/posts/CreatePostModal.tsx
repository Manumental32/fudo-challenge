import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  getSession,
  requestLogin,
  subscribeCreatePost,
  useSession,
} from '../../lib/author';
import { getErrorMessage } from '../../lib/errors';
import { scrollToTop } from '../../lib/scrollToTop';
import { Modal } from '../../ui/Modal';
import { PostForm } from './PostForm';
import { useCreatePost } from './hooks/useCreatePost';

export function CreatePostModal() {
  const [open, setOpen] = useState(false);
  const createAfterLogin = useRef(false);
  const session = useSession();
  const createPost = useCreatePost();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    return subscribeCreatePost(() => {
      if (getSession()) {
        setOpen(true);
        return;
      }

      createAfterLogin.current = true;
      requestLogin();
    });
  }, []);

  useEffect(() => {
    if (!session || !createAfterLogin.current) {
      return;
    }

    createAfterLogin.current = false;
    setOpen(true);
  }, [session]);

  return (
    <Modal
      open={open}
      title="Nueva publicación"
      onClose={() => {
        setOpen(false);
        createPost.reset();
      }}
    >
      {open ? (
        <PostForm
          submitLabel="Publicar"
          pending={createPost.isPending}
          errorMessage={
            createPost.isError
              ? getErrorMessage(createPost.error, 'No se pudo publicar.')
              : undefined
          }
          onSubmit={(values) => {
            createPost.mutate(values, {
              onSuccess: () => {
                setOpen(false);
                if (location.pathname !== '/') {
                  void navigate('/');
                }
                window.setTimeout(() => {
                  scrollToTop();
                }, 0);
              },
            });
          }}
        />
      ) : null}
    </Modal>
  );
}
