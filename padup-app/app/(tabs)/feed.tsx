import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar, Modal,
  TextInput, KeyboardAvoidingView, Platform, Alert,
  Animated, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SCREEN_W = Dimensions.get('window').width;
const SCREEN_H = Dimensions.get('window').height;

const C = {
  bg: '#0A0A0F', surface2: '#18181F', border: 'rgba(255,255,255,0.07)',
  accent: '#4A8FE8', text: '#F0F0F5', muted: '#6B6B7E', card: '#13131A',
  green: '#4ade80', red: '#f87171', gold: '#F5A623',
};

// ─── Stories ──────────────────────────────────────────────────────────────────
const STORY_BG_COLORS = [
  '#1A3A6B', '#2D5FC4', '#1A3F8F', '#0D2A5E',
  '#1A4A2A', '#4A2D8F', '#2E1A4A', '#0D1F3C',
];

type StoryItem = {
  id: string; label: string; initials: string; bg: string;
  type: 'add' | 'unseen' | 'seen' | 'mine';
  content?: { text: string; bg: string; emoji: string };
};

const OTHER_STORIES: StoryItem[] = [
  { id: '1', label: 'Julien', initials: 'JL', bg: '#2B6CB0', type: 'unseen', content: { text: 'Match intense ce soir 💪 On a gagné 6-3 !', bg: '#0D1F3C', emoji: '🎾' } },
  { id: '2', label: 'QG Padel', initials: '🏟️', bg: '#1A3A6B', type: 'unseen', content: { text: 'Terrain 4 disponible dès maintenant. Réservez ! 🏟️', bg: '#0A1428', emoji: '🆕' } },
  { id: '3', label: 'Alice', initials: 'AL', bg: '#3B6FD4', type: 'unseen', content: { text: 'Session du matin ☀️ Qui veut jouer ce weekend ?', bg: '#1A2A4A', emoji: '☀️' } },
  { id: '4', label: 'Raphaël', initials: 'RC', bg: '#1A3F8F', type: 'seen', content: { text: 'Nouveau record perso 🔥', bg: '#1A0A2E', emoji: '🔥' } },
  { id: '5', label: 'Cocoon', initials: '🎾', bg: '#0A1E35', type: 'seen', content: { text: 'Open Padel Mars — inscrivez-vous vite !', bg: '#0A1428', emoji: '🏆' } },
];

// ─── Notifications ─────────────────────────────────────────────────────────────
const NOTIFS = [
  {
    id: 'n1', read: false,
    icon: '❤️', iconBg: 'rgba(248,113,113,0.15)',
    text: 'Julien L. a aimé votre post',
    sub: 'il y a 5 min',
  },
  {
    id: 'n2', read: false,
    icon: '🏟️', iconBg: '#0D1F3C',
    text: 'QG Padel a publié une nouvelle story',
    sub: 'il y a 18 min',
  },
  {
    id: 'n3', read: false,
    icon: '💬', iconBg: 'rgba(74,143,232,0.15)',
    text: 'Alice L. a commenté votre post : "Trop bien ! 🔥"',
    sub: 'il y a 1h',
  },
  {
    id: 'n4', read: false,
    icon: '🏆', iconBg: 'rgba(245,166,35,0.15)',
    text: 'Cocoon Padel : Nouvelles inscriptions ouvertes — Open Mars',
    sub: 'il y a 2h',
  },
  {
    id: 'n5', read: true,
    icon: '👤', iconBg: 'rgba(74,222,128,0.12)',
    text: 'Raphaël C. a commencé à vous suivre',
    sub: 'il y a 3h',
  },
  {
    id: 'n6', read: true,
    icon: '📅', iconBg: 'rgba(74,143,232,0.1)',
    text: 'Rappel : Réservation Terrain 1 — demain à 14h00',
    sub: 'il y a 5h',
  },
  {
    id: 'n7', read: true,
    icon: '🎾', iconBg: '#0A1E35',
    text: 'Cocoon Padel a publié un nouveau post',
    sub: 'il y a 12h',
  },
  {
    id: 'n8', read: true,
    icon: '⚡', iconBg: 'rgba(245,166,35,0.1)',
    text: 'Résultat du match : Victoire 6·4 contre Alice & Raphaël',
    sub: 'Hier',
  },
];

// ─── Commentaires ──────────────────────────────────────────────────────────────
type Comment = {
  id: string; author: string; initials: string; bg: string;
  text: string; when: string; likes: number; liked: boolean;
};

const INITIAL_COMMENTS: Record<string, Comment[]> = {
  '1': [
    { id: 'c1', author: 'Alice Laurent', initials: 'AL', bg: '#2D5FC4', text: "Super nouvelle ! J'ai hâte d'essayer 🎾", when: 'il y a 2h', liked: false, likes: 5 },
    { id: 'c2', author: 'Julien Larue', initials: 'JL', bg: '#2B6CB0', text: 'Terrain réservé pour demain soir 💪', when: 'il y a 1h', liked: true, likes: 3 },
    { id: 'c3', author: 'Raphaël C.', initials: 'RC', bg: '#1A3F8F', text: 'Le terrain 4 Indoor ou Outdoor ?', when: 'il y a 45min', liked: false, likes: 1 },
  ],
  '2': [
    { id: 'c4', author: 'Thomas M.', initials: 'TM', bg: '#1A5FBF', text: 'Incroyable ce smash ! 🔥', when: 'il y a 4h', liked: true, likes: 8 },
    { id: 'c5', author: 'Sofiane M.', initials: 'SM', bg: '#4A2D8F', text: 'On te connaît bien maintenant 😄', when: 'il y a 3h', liked: false, likes: 2 },
  ],
  '3': [
    { id: 'c6', author: 'Raphaël C.', initials: 'RC', bg: '#1A3F8F', text: 'Je suis partant pour la semaine prochaine !', when: 'il y a 7h', liked: false, likes: 2 },
    { id: 'c7', author: 'Sofiane M.', initials: 'SM', bg: '#4A2D8F', text: 'Cocoon ou QG Padel ?', when: 'il y a 6h', liked: false, likes: 1 },
  ],
  '4': [
    { id: 'c8', author: 'Paul D.', initials: 'PD', bg: '#0D3B6E', text: 'Inscrit ! Hâte de jouer 🏆', when: 'il y a 10h', liked: false, likes: 4 },
    { id: 'c9', author: 'Alice Laurent', initials: 'AL', bg: '#2D5FC4', text: '4 places restantes seulement, vite !', when: 'il y a 9h', liked: true, likes: 6 },
  ],
};

// ─── Feed tabs ─────────────────────────────────────────────────────────────────
const FEED_TABS = ['Pour toi', 'Amis', 'Clubs'];

// ─── Posts ─────────────────────────────────────────────────────────────────────
type Post = {
  id: string; avatarBg: string; avatarText: string; isEmoji: boolean;
  author: string; sub: string; hasVisual: boolean; visualBg: string;
  visualTitle: string; visualSub: string; badge: string; isVideo?: boolean;
  text: string; likes: number; comments: number; liked: boolean;
};

const INITIAL_POSTS: Post[] = [
  {
    id: '1', avatarBg: '#1A3A6B', avatarText: '🏟️', isEmoji: true,
    author: 'QG Padel Club', sub: 'Club officiel · il y a 4h',
    hasVisual: true, visualBg: '#0D1F3C',
    visualTitle: 'Nouveau terrain 4', visualSub: 'Maintenant disponible à la réservation',
    badge: '🆕 Ouverture',
    text: 'Notre nouveau terrain 4 est désormais ouvert ! Padel indoor de dernière génération avec éclairage LED. Réservez dès maintenant.',
    likes: 147, comments: 32, liked: false,
  },
  {
    id: '2', avatarBg: '#1A3A6B', avatarText: 'LB', isEmoji: false,
    author: 'Léa Bernard', sub: 'Highlight · il y a 6h',
    hasVisual: true, visualBg: '#1A1A3A',
    visualTitle: '', visualSub: '', badge: '', isVideo: true,
    text: 'Smash parfait en finale du tournoi interne 🔥 #padel #cocoon',
    likes: 89, comments: 12, liked: true,
  },
  {
    id: '3', avatarBg: '#2D5FC4', avatarText: 'AL', isEmoji: false,
    author: 'Alice Laurent', sub: 'Post · il y a 9h',
    hasVisual: false, visualBg: '', visualTitle: '', visualSub: '', badge: '',
    text: 'Belle session ce matin à Cocoon avec les filles 🎾☀️ On recommence la semaine prochaine ? #padel #morning',
    likes: 41, comments: 6, liked: false,
  },
  {
    id: '4', avatarBg: '#0A1E35', avatarText: '🎾', isEmoji: true,
    author: 'Cocoon Padel', sub: 'Club officiel · il y a 12h',
    hasVisual: true, visualBg: '#1E3A7A',
    visualTitle: 'Open Padel Mars', visualSub: 'Samedi 15 mars · 4 places restantes',
    badge: '🏆 Tournoi',
    text: "Les inscriptions se ferment dans 48h. Plus que 4 places disponibles pour l'Open Padel de mars !",
    likes: 56, comments: 9, liked: false,
  },
];

// ─── Story viewer ─────────────────────────────────────────────────────────────
function StoryViewer({ story, onClose }: { story: StoryItem; onClose: () => void }) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, { toValue: 1, duration: 5000, useNativeDriver: false }).start(() => onClose());
  }, []);

  const content = story.content!;
  return (
    <View style={[sv.container, { backgroundColor: content.bg }]}>
      <StatusBar barStyle="light-content" />
      {/* Barre de progression */}
      <View style={sv.progressBar}>
        <Animated.View style={[sv.progressFill, { width: progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }]} />
      </View>
      {/* Header */}
      <View style={sv.header}>
        <View style={[sv.avatar, { backgroundColor: story.bg }]}>
          <Text style={sv.avatarText}>{story.initials}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={sv.authorName}>{story.label}</Text>
          <Text style={sv.authorTime}>il y a 2h</Text>
        </View>
        <TouchableOpacity onPress={onClose} style={sv.closeBtn}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      {/* Contenu */}
      <View style={sv.content}>
        <Text style={sv.emoji}>{content.emoji}</Text>
        <Text style={sv.text}>{content.text}</Text>
      </View>
      {/* Réponse */}
      <View style={sv.footer}>
        <View style={sv.replyBox}>
          <Text style={sv.replyPlaceholder}>Répondre à {story.label}…</Text>
        </View>
        <TouchableOpacity style={sv.replyHeart}>
          <Ionicons name="heart-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Screen ────────────────────────────────────────────────────────────────────
export default function FeedScreen() {
  const [activeTab, setActiveTab] = useState('Pour toi');
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({ '2': true });
  const [postComments, setPostComments] = useState<Record<string, Comment[]>>(INITIAL_COMMENTS);
  const [commentingPostId, setCommentingPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');

  // Notifications
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifs, setNotifs] = useState(NOTIFS);
  const unreadCount = notifs.filter((n) => !n.read).length;

  // Compose post
  const [showCompose, setShowCompose] = useState(false);
  const [composeText, setComposeText] = useState('');

  // Stories
  const [myStory, setMyStory] = useState<{ text: string; bg: string; emoji: string } | null>(null);
  const [showStoryCompose, setShowStoryCompose] = useState(false);
  const [storyText, setStoryText] = useState('');
  const [storyBg, setStoryBg] = useState(STORY_BG_COLORS[0]);
  const [storyEmoji, setStoryEmoji] = useState('🎾');
  const [viewingStory, setViewingStory] = useState<StoryItem | null>(null);
  const [seenStories, setSeenStories] = useState<Set<string>>(new Set());

  const stories: StoryItem[] = [
    myStory
      ? { id: 'me', label: 'Ma story', initials: 'TM', bg: '#1A5FBF', type: 'mine', content: myStory }
      : { id: 'me', label: 'Ma story', initials: '＋', bg: C.surface2, type: 'add' },
    ...OTHER_STORIES.map((s) => ({ ...s, type: seenStories.has(s.id) ? 'seen' as const : s.type })),
  ];

  const toggleLike = (id: string) => {
    setLikedPosts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleCommentLike = (postId: string, commentId: string) => {
    setPostComments((prev) => ({
      ...prev,
      [postId]: (prev[postId] ?? []).map((c) =>
        c.id === commentId ? { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 } : c
      ),
    }));
  };

  const addComment = (postId: string) => {
    const text = commentInput.trim();
    if (!text) return;
    const newComment: Comment = {
      id: `cm-${Date.now()}`,
      author: 'Thomas Mercier', initials: 'TM', bg: '#1A5FBF',
      text, when: "à l'instant", liked: false, likes: 0,
    };
    setPostComments((prev) => ({ ...prev, [postId]: [...(prev[postId] ?? []), newComment] }));
    setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, comments: p.comments + 1 } : p));
    setCommentInput('');
  };

  const commentingPost = posts.find((p) => p.id === commentingPostId);

  function markAllRead() {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function publishPost() {
    const text = composeText.trim();
    if (!text) return;
    const newPost: Post = {
      id: `user-${Date.now()}`,
      avatarBg: '#1A5FBF', avatarText: 'TM', isEmoji: false,
      author: 'Thomas Mercier', sub: "Post · à l'instant",
      hasVisual: false, visualBg: '', visualTitle: '', visualSub: '', badge: '',
      text, likes: 0, comments: 0, liked: false,
    };
    setPosts((prev) => [newPost, ...prev]);
    setComposeText('');
    setShowCompose(false);
  }

  function publishStory() {
    const text = storyText.trim();
    if (!text) return;
    setMyStory({ text, bg: storyBg, emoji: storyEmoji });
    setStoryText('');
    setShowStoryCompose(false);
  }

  function handleStoryPress(story: StoryItem) {
    if (story.id === 'me') {
      if (myStory) {
        setViewingStory({ id: 'me', label: 'Ma story', initials: 'TM', bg: '#1A5FBF', type: 'mine', content: myStory });
      } else {
        setShowStoryCompose(true);
      }
    } else {
      setSeenStories((prev) => new Set(prev).add(story.id));
      setViewingStory(story);
    }
  }

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      {/* Header */}
      <View style={s.header}>
        <Text style={s.pageTitle}>Feed</Text>
        <View style={s.headerActions}>
          {/* Notifications */}
          <TouchableOpacity style={s.iconBtn} onPress={() => setShowNotifs(true)} activeOpacity={0.8}>
            <Ionicons name="notifications-outline" size={18} color={C.text} />
            {unreadCount > 0 && (
              <View style={s.notifBadge}>
                <Text style={s.notifBadgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          {/* Publier */}
          <TouchableOpacity style={s.iconBtnAccent} onPress={() => setShowCompose(true)} activeOpacity={0.8}>
            <Ionicons name="create-outline" size={17} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Stories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.storiesRow}>
          {stories.map((story) => (
            <TouchableOpacity key={story.id} style={s.storyItem} activeOpacity={0.8} onPress={() => handleStoryPress(story)}>
              <View style={[
                s.storyRing,
                story.type === 'add' && s.storyRingAdd,
                story.type === 'seen' && s.storyRingSeen,
                story.type === 'unseen' && s.storyRingUnseen,
                story.type === 'mine' && s.storyRingMine,
              ]}>
                <View style={[s.storyAvatar, { backgroundColor: story.bg }]}>
                  <Text style={s.storyInitials}>{story.initials}</Text>
                </View>
              </View>
              <Text style={[s.storyName, (story.type === 'unseen' || story.type === 'mine') && s.storyNameUnseen]}>
                {story.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Feed tabs */}
        <View style={s.feedTabsWrap}>
          {FEED_TABS.map((tab) => (
            <TouchableOpacity key={tab} style={s.feedTab} onPress={() => setActiveTab(tab)} activeOpacity={0.7}>
              <Text style={[s.feedTabText, activeTab === tab && s.feedTabTextActive]}>{tab}</Text>
              {activeTab === tab && <View style={s.feedTabUnderline} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Posts */}
        <View style={{ paddingTop: 8 }}>
          {posts.map((post) => {
            const liked = likedPosts[post.id] ?? post.liked;
            return (
              <View key={post.id} style={s.card}>
                <View style={s.cardHeader}>
                  <View style={[s.avatar, { backgroundColor: post.avatarBg }]}>
                    <Text style={[s.avatarText, post.isEmoji && s.avatarEmoji]}>{post.avatarText}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.authorName}>{post.author}</Text>
                    <Text style={s.authorSub}>{post.sub}</Text>
                  </View>
                  <Text style={s.moreBtn}>•••</Text>
                </View>

                {post.hasVisual && (
                  <View style={[s.visual, { backgroundColor: post.visualBg }]}>
                    {post.isVideo ? (
                      <>
                        <View style={s.playBtn}><Text style={{ color: '#fff', fontSize: 18 }}>▶</Text></View>
                        <View style={s.videoDuration}><Text style={s.videoDurationText}>0:42</Text></View>
                        <View style={s.videoLabel}><Text style={s.videoLabelText}>▶ VIDÉO</Text></View>
                      </>
                    ) : (
                      <>
                        <View style={s.fvCourt} />
                        {post.visualTitle ? (
                          <View style={s.fvOverlay}>
                            <Text style={s.fvTitle}>{post.visualTitle}</Text>
                            {post.visualSub ? <Text style={s.fvSub}>{post.visualSub}</Text> : null}
                          </View>
                        ) : null}
                        {post.badge ? (
                          <View style={s.fvBadge}><Text style={s.fvBadgeText}>{post.badge}</Text></View>
                        ) : null}
                      </>
                    )}
                  </View>
                )}

                <Text style={s.feedText}>{post.text}</Text>

                <View style={s.actions}>
                  <TouchableOpacity style={s.actionBtn} onPress={() => toggleLike(post.id)}>
                    <Ionicons name={liked ? 'heart' : 'heart-outline'} size={18} color={liked ? C.red : C.muted} />
                    <Text style={[s.actionCount, liked && { color: C.red }]}>
                      {post.likes + (liked && !post.liked ? 1 : !liked && post.liked ? -1 : 0)}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={s.actionBtn} onPress={() => { setCommentingPostId(post.id); setCommentInput(''); }}>
                    <Ionicons name="chatbubble-outline" size={17} color={C.muted} />
                    <Text style={s.actionCount}>{(postComments[post.id]?.length ?? 0) || post.comments}</Text>
                  </TouchableOpacity>
                  <View style={{ flex: 1 }} />
                  <TouchableOpacity>
                    <Ionicons name="share-outline" size={18} color={C.muted} />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* ── Modal Commentaires ───────────────────────────────────────────────── */}
      <Modal visible={!!commentingPostId} transparent animationType="slide" onRequestClose={() => setCommentingPostId(null)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={m.overlay}>
          <TouchableOpacity style={m.backdrop} activeOpacity={1} onPress={() => setCommentingPostId(null)} />
          <View style={cm.sheet}>
            <View style={m.handle} />
            {/* Header */}
            <View style={m.sheetHeader}>
              <Text style={m.sheetTitle}>Commentaires{commentingPostId && postComments[commentingPostId] ? ` · ${postComments[commentingPostId].length}` : ''}</Text>
              <TouchableOpacity onPress={() => setCommentingPostId(null)}>
                <Ionicons name="close" size={20} color={C.muted} />
              </TouchableOpacity>
            </View>

            {/* Post résumé */}
            {commentingPost && (
              <View style={cm.postPreview}>
                <View style={[s.avatar, { backgroundColor: commentingPost.avatarBg }]}>
                  <Text style={[s.avatarText, commentingPost.isEmoji && s.avatarEmoji]}>{commentingPost.avatarText}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={cm.previewAuthor}>{commentingPost.author}</Text>
                  <Text style={cm.previewText} numberOfLines={2}>{commentingPost.text}</Text>
                </View>
              </View>
            )}

            {/* Liste commentaires */}
            <ScrollView style={{ maxHeight: 320 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 8 }}>
              {commentingPostId && (postComments[commentingPostId] ?? []).length === 0 && (
                <View style={cm.empty}>
                  <Text style={cm.emptyText}>Aucun commentaire · Soyez le premier !</Text>
                </View>
              )}
              {commentingPostId && (postComments[commentingPostId] ?? []).map((c) => (
                <View key={c.id} style={cm.commentRow}>
                  <View style={[cm.commentAvatar, { backgroundColor: c.bg }]}>
                    <Text style={cm.commentInitials}>{c.initials}</Text>
                  </View>
                  <View style={cm.commentBody}>
                    <View style={cm.commentTop}>
                      <Text style={cm.commentAuthor}>{c.author}</Text>
                      <Text style={cm.commentWhen}>{c.when}</Text>
                    </View>
                    <Text style={cm.commentText}>{c.text}</Text>
                  </View>
                  <TouchableOpacity style={cm.commentLike} onPress={() => toggleCommentLike(commentingPostId!, c.id)}>
                    <Ionicons name={c.liked ? 'heart' : 'heart-outline'} size={14} color={c.liked ? C.red : C.muted} />
                    {c.likes > 0 && <Text style={[cm.commentLikeCount, c.liked && { color: C.red }]}>{c.likes}</Text>}
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>

            {/* Saisie */}
            <View style={cm.inputRow}>
              <View style={[cm.inputAvatar, { backgroundColor: '#1A5FBF' }]}>
                <Text style={cm.commentInitials}>TM</Text>
              </View>
              <TextInput
                style={cm.input}
                placeholder="Ajouter un commentaire…"
                placeholderTextColor={C.muted}
                value={commentInput}
                onChangeText={setCommentInput}
                multiline
                maxLength={200}
              />
              <TouchableOpacity
                style={[cm.sendBtn, !commentInput.trim() && cm.sendBtnOff]}
                disabled={!commentInput.trim()}
                onPress={() => addComment(commentingPostId!)}
                activeOpacity={0.8}
              >
                <Ionicons name="send" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ── Story Viewer ─────────────────────────────────────────────────────── */}
      <Modal visible={!!viewingStory} transparent={false} animationType="fade" onRequestClose={() => setViewingStory(null)}>
        {viewingStory && <StoryViewer story={viewingStory} onClose={() => setViewingStory(null)} />}
      </Modal>

      {/* ── Story Compose ─────────────────────────────────────────────────────── */}
      <Modal visible={showStoryCompose} transparent animationType="slide" onRequestClose={() => setShowStoryCompose(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={m.overlay}>
          <TouchableOpacity style={m.backdrop} activeOpacity={1} onPress={() => setShowStoryCompose(false)} />
          <View style={[m.sheet, { paddingBottom: 40 }]}>
            <View style={m.handle} />
            <View style={m.sheetHeader}>
              <Text style={m.sheetTitle}>Créer une story</Text>
              <TouchableOpacity onPress={() => setShowStoryCompose(false)}>
                <Ionicons name="close" size={20} color={C.muted} />
              </TouchableOpacity>
            </View>

            {/* Aperçu */}
            <View style={[sc.preview, { backgroundColor: storyBg }]}>
              <Text style={sc.previewEmoji}>{storyEmoji}</Text>
              <Text style={sc.previewText} numberOfLines={4}>
                {storyText || 'Votre texte apparaîtra ici…'}
              </Text>
            </View>

            {/* Sélecteur couleur fond */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={sc.colorRow}>
              {STORY_BG_COLORS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[sc.colorDot, { backgroundColor: color }, storyBg === color && sc.colorDotActive]}
                  onPress={() => setStoryBg(color)}
                />
              ))}
            </ScrollView>

            {/* Sélecteur emoji */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={sc.emojiRow}>
              {['🎾', '🏆', '🔥', '💪', '⚡', '🏟️', '☀️', '🎯', '👊', '🥇'].map((e) => (
                <TouchableOpacity
                  key={e}
                  style={[sc.emojiBtn, storyEmoji === e && sc.emojiBtnActive]}
                  onPress={() => setStoryEmoji(e)}
                >
                  <Text style={{ fontSize: 20 }}>{e}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Texte */}
            <TextInput
              style={sc.input}
              placeholder="Écrivez votre story…"
              placeholderTextColor={C.muted}
              value={storyText}
              onChangeText={setStoryText}
              multiline
              maxLength={120}
            />
            <Text style={[m.charCount, { paddingHorizontal: 20 }]}>{storyText.length}/120</Text>

            <TouchableOpacity
              style={[sc.publishBtn, !storyText.trim() && sc.publishBtnOff]}
              onPress={publishStory}
              disabled={!storyText.trim()}
              activeOpacity={0.85}
            >
              <Ionicons name="radio-outline" size={16} color="#fff" />
              <Text style={sc.publishBtnText}>Publier la story</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ── Modal Notifications ───────────────────────────────────────────────── */}
      <Modal visible={showNotifs} transparent animationType="slide" onRequestClose={() => setShowNotifs(false)}>
        <View style={m.overlay}>
          <TouchableOpacity style={m.backdrop} activeOpacity={1} onPress={() => setShowNotifs(false)} />
          <View style={m.sheet}>
            <View style={m.handle} />

            <View style={m.sheetHeader}>
              <Text style={m.sheetTitle}>Notifications</Text>
              <View style={m.sheetHeaderRight}>
                {unreadCount > 0 && (
                  <TouchableOpacity onPress={markAllRead} activeOpacity={0.7}>
                    <Text style={m.markAllText}>Tout lire</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => setShowNotifs(false)}>
                  <Ionicons name="close" size={20} color={C.muted} />
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 520 }}>
              {notifs.map((n) => (
                <TouchableOpacity
                  key={n.id}
                  style={[m.notifRow, !n.read && m.notifRowUnread]}
                  activeOpacity={0.7}
                  onPress={() => setNotifs((prev) => prev.map((x) => x.id === n.id ? { ...x, read: true } : x))}
                >
                  <View style={[m.notifIcon, { backgroundColor: n.iconBg }]}>
                    <Text style={{ fontSize: 16 }}>{n.icon}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[m.notifText, !n.read && m.notifTextUnread]}>{n.text}</Text>
                    <Text style={m.notifSub}>{n.sub}</Text>
                  </View>
                  {!n.read && <View style={m.unreadDot} />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ── Modal Publier ─────────────────────────────────────────────────────── */}
      <Modal visible={showCompose} transparent animationType="slide" onRequestClose={() => setShowCompose(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={m.overlay}>
          <TouchableOpacity style={m.backdrop} activeOpacity={1} onPress={() => setShowCompose(false)} />
          <View style={m.sheet}>
            <View style={m.handle} />

            <View style={m.sheetHeader}>
              <Text style={m.sheetTitle}>Nouveau post</Text>
              <View style={m.sheetHeaderRight}>
                <TouchableOpacity onPress={() => setShowCompose(false)}>
                  <Ionicons name="close" size={20} color={C.muted} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Auteur */}
            <View style={m.composeAuthor}>
              <View style={[s.avatar, { backgroundColor: '#1A5FBF', width: 42, height: 42, borderRadius: 13 }]}>
                <Text style={[s.avatarText, { fontSize: 15 }]}>TM</Text>
              </View>
              <View>
                <Text style={m.composeAuthorName}>Thomas Mercier</Text>
                <View style={m.audiencePill}>
                  <Ionicons name="people" size={10} color={C.accent} />
                  <Text style={m.audienceText}>Abonnés</Text>
                  <Ionicons name="chevron-down" size={10} color={C.accent} />
                </View>
              </View>
            </View>

            {/* Texte */}
            <TextInput
              style={m.composeInput}
              placeholder="Quoi de neuf sur les courts ? 🎾"
              placeholderTextColor={C.muted}
              value={composeText}
              onChangeText={setComposeText}
              multiline
              autoFocus
              maxLength={280}
            />

            <Text style={m.charCount}>{composeText.length}/280</Text>

            {/* Média & options */}
            <View style={m.composeOptions}>
              <TouchableOpacity style={m.composeOption} onPress={() => Alert.alert('Photo', 'Ajouter une photo')}>
                <Ionicons name="image-outline" size={20} color={C.accent} />
              </TouchableOpacity>
              <TouchableOpacity style={m.composeOption} onPress={() => Alert.alert('Vidéo', 'Ajouter une vidéo')}>
                <Ionicons name="videocam-outline" size={20} color={C.accent} />
              </TouchableOpacity>
              <TouchableOpacity style={m.composeOption} onPress={() => Alert.alert('Score', 'Partager un résultat')}>
                <Ionicons name="trophy-outline" size={20} color={C.accent} />
              </TouchableOpacity>
              <TouchableOpacity style={m.composeOption} onPress={() => Alert.alert('Lieu', 'Ajouter un lieu')}>
                <Ionicons name="location-outline" size={20} color={C.accent} />
              </TouchableOpacity>
              <View style={{ flex: 1 }} />
              <TouchableOpacity
                style={[m.publishBtn, !composeText.trim() && m.publishBtnOff]}
                onPress={publishPost}
                disabled={!composeText.trim()}
                activeOpacity={0.85}
              >
                <Text style={m.publishBtnText}>Publier</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 20, paddingBottom: 16 },
  pageTitle: { fontWeight: '800', fontSize: 24, color: C.text, letterSpacing: -0.5 },
  headerActions: { flexDirection: 'row', gap: 8 },
  iconBtn: { width: 38, height: 38, backgroundColor: C.surface2, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border },
  iconBtnAccent: { width: 38, height: 38, backgroundColor: C.accent, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  notifBadge: { position: 'absolute', top: -4, right: -4, minWidth: 16, height: 16, borderRadius: 8, backgroundColor: C.red, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3, borderWidth: 2, borderColor: C.bg },
  notifBadgeText: { fontSize: 8, fontWeight: '800', color: '#fff' },

  storiesRow: { flexDirection: 'row', gap: 14, paddingHorizontal: 20, paddingBottom: 20 },
  storyItem: { alignItems: 'center', gap: 5 },
  storyRing: { width: 58, height: 58, borderRadius: 18, padding: 2 },
  storyRingUnseen: { backgroundColor: C.accent },
  storyRingSeen: { backgroundColor: C.surface2, borderWidth: 1.5, borderColor: C.border },
  storyRingAdd: { backgroundColor: C.surface2, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.15)', borderStyle: 'dashed' },
  storyRingMine: { backgroundColor: C.accent },
  storyAvatar: { flex: 1, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  storyInitials: { fontSize: 16, fontWeight: '700', color: '#fff' },
  storyName: { fontSize: 10, fontWeight: '600', color: C.muted, maxWidth: 58, textAlign: 'center' },
  storyNameUnseen: { color: C.text },

  feedTabsWrap: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: C.border, marginBottom: 16 },
  feedTab: { paddingVertical: 12, paddingHorizontal: 20, position: 'relative' },
  feedTabText: { fontWeight: '700', fontSize: 13, color: C.muted },
  feedTabTextActive: { color: C.accent },
  feedTabUnderline: { position: 'absolute', bottom: -1, left: 16, right: 16, height: 2, backgroundColor: C.accent, borderRadius: 2 },

  card: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 20, marginHorizontal: 16, marginBottom: 20, overflow: 'hidden' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, paddingBottom: 12 },
  avatar: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontWeight: '700', fontSize: 13, color: '#fff' },
  avatarEmoji: { fontSize: 18 },
  authorName: { fontWeight: '700', fontSize: 13, color: C.text },
  authorSub: { fontSize: 11, color: C.muted, marginTop: 1 },
  moreBtn: { fontSize: 14, color: C.muted, letterSpacing: 1 },

  visual: { width: '100%', height: 180, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  fvCourt: { width: 150, height: 100, borderWidth: 2, borderColor: 'rgba(255,255,255,0.18)', borderRadius: 4, opacity: 0.7 },
  fvOverlay: { position: 'absolute', bottom: 12, left: 14 },
  fvTitle: { fontWeight: '800', fontSize: 16, color: 'rgba(255,255,255,0.9)', lineHeight: 20 },
  fvSub: { fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2 },
  fvBadge: { position: 'absolute', top: 12, right: 12, backgroundColor: 'rgba(74,143,232,0.2)', borderWidth: 1, borderColor: 'rgba(74,143,232,0.4)', borderRadius: 100, paddingVertical: 4, paddingHorizontal: 10 },
  fvBadgeText: { fontSize: 10, fontWeight: '700', color: C.accent },
  playBtn: { width: 48, height: 48, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 24, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.25)' },
  videoDuration: { position: 'absolute', bottom: 10, right: 12, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 6, paddingVertical: 2, paddingHorizontal: 7 },
  videoDurationText: { fontSize: 10, fontWeight: '700', color: '#fff' },
  videoLabel: { position: 'absolute', top: 10, left: 12, backgroundColor: 'rgba(239,68,68,0.85)', borderRadius: 6, paddingVertical: 2, paddingHorizontal: 7 },
  videoLabelText: { fontSize: 9, fontWeight: '700', color: '#fff', letterSpacing: 0.5 },

  feedText: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 14, fontSize: 13, lineHeight: 21, color: C.text },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingBottom: 16, borderTopWidth: 1, borderTopColor: C.border, paddingTop: 12 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  actionCount: { fontSize: 13, color: C.muted, fontWeight: '600' },
});

// ─── Styles modals ─────────────────────────────────────────────────────────────
const m = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)' },
  sheet: {
    backgroundColor: '#111118', borderTopLeftRadius: 28, borderTopRightRadius: 28,
    paddingBottom: 36, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
  },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.15)', alignSelf: 'center', marginTop: 14, marginBottom: 4 },

  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.07)' },
  sheetTitle: { fontWeight: '800', fontSize: 17, color: C.text, letterSpacing: -0.3 },
  sheetHeaderRight: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  markAllText: { fontSize: 13, color: C.accent, fontWeight: '700' },

  // Notifs
  notifRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)' },
  notifRowUnread: { backgroundColor: 'rgba(74,143,232,0.04)' },
  notifIcon: { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  notifText: { fontSize: 13, color: C.muted, lineHeight: 18, fontWeight: '500' },
  notifTextUnread: { color: C.text, fontWeight: '700' },
  notifSub: { fontSize: 11, color: C.muted, marginTop: 3 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.accent, flexShrink: 0 },

  // Compose
  composeAuthor: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingVertical: 16 },
  composeAuthorName: { fontWeight: '700', fontSize: 14, color: C.text, marginBottom: 4 },
  audiencePill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(74,143,232,0.1)', borderWidth: 1, borderColor: 'rgba(74,143,232,0.25)', borderRadius: 20, paddingVertical: 3, paddingHorizontal: 8 },
  audienceText: { fontSize: 10, fontWeight: '700', color: C.accent },
  composeInput: { minHeight: 120, paddingHorizontal: 20, fontSize: 15, lineHeight: 22, color: C.text },
  charCount: { textAlign: 'right', paddingHorizontal: 20, fontSize: 11, color: C.muted, marginBottom: 8 },
  composeOptions: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)' },
  composeOption: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 10 },
  publishBtn: { backgroundColor: C.accent, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 20 },
  publishBtnOff: { backgroundColor: C.surface2, opacity: 0.5 },
  publishBtnText: { fontWeight: '800', fontSize: 14, color: '#fff' },
});

// ─── Comment modal styles ─────────────────────────────────────────────────────
const cm = StyleSheet.create({
  sheet: { backgroundColor: '#111118', borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingBottom: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', maxHeight: SCREEN_H * 0.85 },
  postPreview: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' },
  previewAuthor: { fontWeight: '700', fontSize: 12, color: C.text, marginBottom: 2 },
  previewText: { fontSize: 12, color: C.muted, lineHeight: 17 },
  empty: { alignItems: 'center', paddingVertical: 32 },
  emptyText: { fontSize: 13, color: C.muted, fontWeight: '600' },
  commentRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)' },
  commentAvatar: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  commentInitials: { fontWeight: '700', fontSize: 12, color: '#fff' },
  commentBody: { flex: 1 },
  commentTop: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 3 },
  commentAuthor: { fontWeight: '700', fontSize: 12, color: C.text },
  commentWhen: { fontSize: 10, color: C.muted },
  commentText: { fontSize: 13, color: C.text, lineHeight: 18 },
  commentLike: { alignItems: 'center', gap: 2, paddingTop: 2, minWidth: 24 },
  commentLikeCount: { fontSize: 10, color: C.muted, fontWeight: '700' },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, paddingHorizontal: 14, paddingTop: 12, paddingBottom: 8, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)' },
  inputAvatar: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginBottom: 4 },
  input: { flex: 1, backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, fontSize: 13, color: C.text, maxHeight: 80 },
  sendBtn: { width: 36, height: 36, borderRadius: 11, backgroundColor: C.accent, alignItems: 'center', justifyContent: 'center', marginBottom: 2 },
  sendBtnOff: { backgroundColor: C.surface2, opacity: 0.5 },
});

// ─── Story viewer styles ───────────────────────────────────────────────────────
const sv = StyleSheet.create({
  container: { flex: 1, paddingTop: 56 },
  progressBar: { position: 'absolute', top: 52, left: 16, right: 16, height: 2, backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#fff', borderRadius: 2 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12 },
  avatar: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)' },
  avatarText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  authorName: { fontWeight: '700', fontSize: 14, color: '#fff' },
  authorTime: { fontSize: 11, color: 'rgba(255,255,255,0.6)' },
  closeBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  emoji: { fontSize: 64, marginBottom: 24 },
  text: { fontSize: 22, fontWeight: '700', color: '#fff', textAlign: 'center', lineHeight: 32 },
  footer: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingBottom: 48 },
  replyBox: { flex: 1, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.4)', borderRadius: 24, paddingVertical: 12, paddingHorizontal: 18 },
  replyPlaceholder: { color: 'rgba(255,255,255,0.5)', fontSize: 14 },
  replyHeart: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
});

// ─── Story compose styles ──────────────────────────────────────────────────────
const sc = StyleSheet.create({
  preview: { marginHorizontal: 20, marginBottom: 16, borderRadius: 20, height: 160, alignItems: 'center', justifyContent: 'center', gap: 10, padding: 20 },
  previewEmoji: { fontSize: 36 },
  previewText: { fontSize: 16, fontWeight: '600', color: 'rgba(255,255,255,0.85)', textAlign: 'center', lineHeight: 22 },
  colorRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, paddingBottom: 14 },
  colorDot: { width: 28, height: 28, borderRadius: 14 },
  colorDotActive: { borderWidth: 3, borderColor: '#fff' },
  emojiRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 20, paddingBottom: 14 },
  emojiBtn: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border },
  emojiBtnActive: { borderColor: C.accent, backgroundColor: 'rgba(74,143,232,0.15)' },
  input: { marginHorizontal: 20, backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border, borderRadius: 14, padding: 14, fontSize: 14, color: C.text, minHeight: 80, marginBottom: 6 },
  publishBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginHorizontal: 20, marginTop: 10, backgroundColor: C.accent, borderRadius: 14, paddingVertical: 15 },
  publishBtnOff: { backgroundColor: C.surface2, opacity: 0.5 },
  publishBtnText: { fontWeight: '800', fontSize: 15, color: '#fff' },
});
