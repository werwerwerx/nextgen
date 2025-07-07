"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  RefreshCw, 
  Search, 
  User, 
  Bell,
  BellOff,
  Info,
  AlertCircle,
  ExternalLink,
  UserPlus,
  UserMinus,
  Calendar,
  Filter,
  Mail,
  Plus
} from "lucide-react";

interface TelegramMessage {
  update_id: number;
  message_id?: number;
  user_id?: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  chat_id?: number;
  chat_type?: string;
  text?: string;
  date?: string;
}

interface Observer {
  id: number;
  observer_telegram_id: string;
  obvserver_email: string | null;
  created_at: string;
}

type NotificationFilter = 'all' | 'enabled' | 'disabled';
type DateFilter = 'all' | 'today' | 'week' | 'month';

export function TelegramSection() {
  const [messages, setMessages] = useState<TelegramMessage[]>([]);
  const [observers, setObservers] = useState<Observer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [notificationFilter, setNotificationFilter] = useState<NotificationFilter>('all');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');

  // Состояние для добавления email наблюдателя
  const [newEmail, setNewEmail] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);

  const botLink = process.env.NEXT_PUBLIC_TELEGRAM_BOT_LINK || '';

  const fetchTelegramUpdates = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [messagesResponse, observersResponse] = await Promise.all([
        fetch('/api/telegram'),
        fetch('/api/telegram/observers')
      ]);

      const messagesResult = await messagesResponse.json();
      const observersResult = await observersResponse.json();

      if (messagesResult.success) {
        const sortedMessages = messagesResult.data.sort((a: TelegramMessage, b: TelegramMessage) => b.update_id - a.update_id);
        setMessages(sortedMessages);
      } else {
        setError(messagesResult.error || 'Не удалось получить обновления Telegram');
      }

      if (observersResult.success) {
        setObservers(observersResult.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Произошла ошибка сети');
    } finally {
      setLoading(false);
    }
  };

  const handleObserverAction = async (telegramId: string, action: 'add' | 'remove') => {
    setActionLoading(telegramId);
    
    try {
      const response = await fetch('/api/telegram/observers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          telegram_id: telegramId,
          action,
        }),
      });

      const result = await response.json();

      if (result.success) {
        await fetchTelegramUpdates();
      } else {
        setError(result.error || 'Не удалось обновить наблюдателя');
      }
    } catch (error) {
      console.error('Error updating observer:', error);
      setError('Произошла ошибка сети');
    } finally {
      setActionLoading(null);
    }
  };

  const handleAddEmailObserver = async () => {
    if (!newEmail.trim()) return;
    
    setEmailLoading(true);
    
    try {
      const response = await fetch('/api/telegram/observers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: newEmail.trim(),
          action: 'add',
        }),
      });

      const result = await response.json();

      if (result.success) {
        setNewEmail('');
        await fetchTelegramUpdates();
      } else {
        setError(result.error || 'Не удалось добавить email наблюдателя');
      }
    } catch (error) {
      console.error('Error adding email observer:', error);
      setError('Произошла ошибка сети');
    } finally {
      setEmailLoading(false);
    }
  };

  const handleRemoveEmailObserver = async (email: string) => {
    setActionLoading(email);
    
    try {
      const response = await fetch('/api/telegram/observers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          action: 'remove',
        }),
      });

      const result = await response.json();

      if (result.success) {
        await fetchTelegramUpdates();
      } else {
        setError(result.error || 'Не удалось удалить email наблюдателя');
      }
    } catch (error) {
      console.error('Error removing email observer:', error);
      setError('Произошла ошибка сети');
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    fetchTelegramUpdates();
  }, []);

  const isObserver = (telegramId: string) => {
    return observers.some(obs => obs.observer_telegram_id === telegramId);
  };

  const getUserDisplayName = (message: TelegramMessage) => {
    const firstName = message.first_name || '';
    const lastName = message.last_name || '';
    const username = message.username ? `@${message.username}` : '';
    
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName || username || `Пользователь ${message.user_id}`;
  };

  // Объединяем данные из Telegram сообщений и email наблюдателей
  const allObservers = useMemo(() => {
    const telegramUsers = messages.map(msg => ({
      id: `telegram_${msg.user_id}`,
      type: 'telegram' as const,
      telegram_id: msg.user_id?.toString() || '',
      email: null,
      name: getUserDisplayName(msg),
      username: msg.username,
      date: msg.date,
      hasNotifications: msg.user_id ? isObserver(msg.user_id.toString()) : false
    }));

    const emailUsers = observers
      .filter(obs => obs.obvserver_email && !obs.observer_telegram_id)
      .map(obs => ({
        id: `email_${obs.id}`,
        type: 'email' as const,
        telegram_id: '',
        email: obs.obvserver_email,
        name: obs.obvserver_email,
        username: null,
        date: obs.created_at,
        hasNotifications: true
      }));

    return [...telegramUsers, ...emailUsers];
  }, [messages, observers]);

  const filteredObservers = useMemo(() => {
    let filtered = allObservers;

    if (searchTerm) {
      filtered = filtered.filter(obs =>
        obs.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        obs.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        obs.username?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (notificationFilter !== 'all') {
      filtered = filtered.filter(obs => {
        return notificationFilter === 'enabled' ? obs.hasNotifications : !obs.hasNotifications;
      });
    }

    if (dateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter(obs => {
        if (!obs.date) return false;
        const obsDate = new Date(obs.date);
        
        switch (dateFilter) {
          case 'today':
            return obsDate >= today;
          case 'week':
            const weekAgo = new Date(today);
            weekAgo.setDate(today.getDate() - 7);
            return obsDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(today);
            monthAgo.setMonth(today.getMonth() - 1);
            return obsDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [allObservers, searchTerm, notificationFilter, dateFilter]);

  const totalPages = Math.ceil(filteredObservers.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedObservers = filteredObservers.slice(startIndex, startIndex + pageSize);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const activeObserversCount = observers.length;
  const totalUsersCount = allObservers.length;

  return (
    <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Брокер Уведомлений
        </h3>
        <div className="flex items-center gap-3">
          <div className="text-sm text-muted-foreground">
            <span className="font-medium text-green-600">{activeObserversCount}</span> из {totalUsersCount} получают уведомления
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchTelegramUpdates}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Обновить
          </Button>
        </div>
      </div>

      <div className="mb-6 space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-blue-900 mb-2">Как работает брокер уведомлений:</p>
              <ul className="text-blue-800 space-y-1 list-disc list-inside">
                <li>Пользователи Telegram пишут боту и появляются в списке заявок</li>
                <li>Email наблюдатели добавляются вручную через форму ниже</li>
                <li>Вы решаете, кому разрешить получать уведомления о новых заявках</li>
                <li>Только одобренные пользователи получат уведомления (Telegram + Email)</li>
                <li>Управляйте списком наблюдателей с помощью кнопок в таблице</li>
              </ul>
            </div>
          </div>
        </div>

        {botLink ? (
          <div className="flex items-center justify-between p-4 bg-background border rounded-lg">
            <div className="flex items-center gap-3">
              <MessageCircle className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium">Ссылка на Telegram бота</p>
                <p className="text-sm text-muted-foreground">
                  Поделитесь этой ссылкой с теми, кто должен получать уведомления
                </p>
              </div>
            </div>
            <Button variant="outline" asChild>
              <a href={botLink} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Открыть бота
              </a>
            </Button>
          </div>
        ) : (
          console.log('NEXT_PUBLIC_TELEGRAM_BOT_LINK не настроена'),
          null
        )}

        <div className="flex items-center justify-between p-4 bg-background border rounded-lg">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-purple-600" />
            <div>
              <p className="font-medium">Добавить Email наблюдателя</p>
              <p className="text-sm text-muted-foreground">
                Email адрес для получения уведомлений о новых заявках
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="email"
              placeholder="email@example.com"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-64"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddEmailObserver();
                }
              }}
            />
            <Button
              onClick={handleAddEmailObserver}
              disabled={emailLoading || !newEmail.trim()}
            >
              {emailLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Добавить
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск по имени пользователя..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10"
          />
        </div>

        <Select value={notificationFilter} onValueChange={(value: NotificationFilter) => {
          setNotificationFilter(value);
          setCurrentPage(1);
        }}>
          <SelectTrigger>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все пользователи</SelectItem>
            <SelectItem value="enabled">Получают уведомления</SelectItem>
            <SelectItem value="disabled">Без уведомлений</SelectItem>
          </SelectContent>
        </Select>

        <Select value={dateFilter} onValueChange={(value: DateFilter) => {
          setDateFilter(value);
          setCurrentPage(1);
        }}>
          <SelectTrigger>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все время</SelectItem>
            <SelectItem value="today">Сегодня</SelectItem>
            <SelectItem value="week">За неделю</SelectItem>
            <SelectItem value="month">За месяц</SelectItem>
          </SelectContent>
        </Select>

        <Select value={pageSize.toString()} onValueChange={(value) => {
          setPageSize(Number(value));
          setCurrentPage(1);
        }}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10 на странице</SelectItem>
            <SelectItem value="20">20 на странице</SelectItem>
            <SelectItem value="50">50 на странице</SelectItem>
            <SelectItem value="100">100 на странице</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {paginatedObservers.length > 0 ? (
        <div className="space-y-4">
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Наблюдатель</TableHead>
                  <TableHead>Дата добавления</TableHead>
                  <TableHead>Статус уведомлений</TableHead>
                  <TableHead>Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedObservers.map((observer) => {
                  const isLoading = actionLoading === (observer.type === 'telegram' ? observer.telegram_id : observer.email);
                  
                  return (
                    <TableRow key={observer.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {observer.type === 'telegram' ? (
                            <MessageCircle className="h-4 w-4 text-blue-500" />
                          ) : (
                            <Mail className="h-4 w-4 text-purple-500" />
                          )}
                          <div>
                            <div className="font-medium">
                              {observer.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {observer.type === 'telegram' 
                                ? (observer.username ? `@${observer.username}` : `ID: ${observer.telegram_id}`)
                                : observer.email
                              }
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(observer.date)}
                      </TableCell>
                      <TableCell>
                        {observer.hasNotifications ? (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            <Bell className="h-3 w-3 mr-1" />
                            Получает уведомления
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <BellOff className="h-3 w-3 mr-1" />
                            Без уведомлений
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {observer.hasNotifications ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (observer.type === 'telegram') {
                                handleObserverAction(observer.telegram_id, 'remove');
                              } else {
                                handleRemoveEmailObserver(observer.email!);
                              }
                            }}
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <UserMinus className="h-4 w-4 mr-2" />
                                Запретить
                              </>
                            )}
                          </Button>
                        ) : (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => {
                              if (observer.type === 'telegram') {
                                handleObserverAction(observer.telegram_id, 'add');
                              }
                            }}
                            disabled={isLoading || observer.type === 'email'}
                          >
                            {isLoading ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <UserPlus className="h-4 w-4 mr-2" />
                                Разрешить
                              </>
                            )}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Показано {startIndex + 1}-{Math.min(startIndex + pageSize, filteredObservers.length)} из {filteredObservers.length}
              </span>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Назад
                </Button>
                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1;
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="w-8 h-8 p-0"
                        >
                          {page}
                        </Button>
                      );
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return <span key={page} className="text-muted-foreground">...</span>;
                    }
                    return null;
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Вперед
                </Button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <RefreshCw className="h-5 w-5 animate-spin" />
              Загрузка заявок...
            </div>
          ) : filteredObservers.length === 0 && allObservers.length > 0 ? (
            <>
              <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Нет пользователей, соответствующих фильтрам</p>
            </>
          ) : (
            <>
              <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="font-medium mb-2">Пока нет заявок на уведомления</p>
              <p className="text-sm">
                Пользователи появятся здесь, когда напишут боту первое сообщение
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
} 