// components/AttendeesList.js

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { theme } from '../theme';
import { statusColors, statusTagVariants } from '../utils/statusColors';
import Button from './Button/Button';
import Tag from './Tag';
import Typography from '../components/Typography';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const AttendeesList = ({ attendees, needsVehicle, onApprove, onReject }) => (

  <ListWrapper>
    <Typography $variant='title-3-semibold' as='h2'>Lista de asistentes</Typography>

    {attendees.length > 0 ? (
      <Table>
        <ListHeader>
          <HeaderCellName>
            <Typography as="p" $variant="overline-semibold" color={theme.colors.defaultWeak} $textTransform='uppercase'>
              Nombre
            </Typography>
          </HeaderCellName>
          {needsVehicle && (
            <HeaderCellVehicle>
              <Typography as="p" $variant="overline-semibold" color={theme.colors.defaultWeak} $textTransform='uppercase'>
                Vehículo
              </Typography>
            </HeaderCellVehicle>
          )}
          <HeaderCellTicket>
            <Typography as="p" $variant="overline-semibold" color={theme.colors.defaultWeak} $textTransform='uppercase'>
              Entrada
            </Typography>
          </HeaderCellTicket>
          <HeaderCellEnrollmentDate>
            <Typography as="p" $variant="overline-semibold" color={theme.colors.defaultWeak} $textTransform='uppercase'>
              Fecha
            </Typography>
          </HeaderCellEnrollmentDate>
          <HeaderCellStatus>
            <Typography as="p" $variant="overline-semibold" color={theme.colors.defaultWeak} $textTransform='uppercase'>
              Estado
            </Typography>
          </HeaderCellStatus>
          <HeaderCellActions></HeaderCellActions>
        </ListHeader>
        <List>
          {attendees.map((attendee) => (
            <ListRow key={attendee._id}>
              <TableCellName>
                <Avatar src={attendee.userId.userAvatar} alt={`${attendee.userId.name} avatar`} />
                <AttendeeData>
                  <Typography as="p" $variant="body-2-semibold">
                    {attendee.userId.name} {attendee.userId.lastName}
                  </Typography>
                  <Typography as="p" $variant="body-2-regular">
                    {attendee.userId.email}
                  </Typography>
                </AttendeeData>
              </TableCellName>
              {needsVehicle && (
                <TableCellVehicle>
                  <Typography as="p" $variant="body-2-regular">
                    {attendee.vehicleId.brand}
                  </Typography>
                  <Typography as="p" $variant="body-2-regular">
                    {attendee.vehicleId.model}
                  </Typography>
                </TableCellVehicle>
              )}
              <TableCellTicket>
                <Typography as="p" $variant="body-2-regular">
                  {attendee.ticketId.name}
                </Typography>
                <Typography as="p" $variant="body-2-regular">
                  {attendee.ticketId.type === 'free' ? 'Gratis' : `${attendee.ticketId.price}€`}
                </Typography>
              </TableCellTicket>
              <TableCellEnrollmentDate>
                <Typography as="p" $variant="body-2-regular">
                  {format(new Date(attendee.createdAt), 'dd/MM/yyyy', { locale: es })}
                </Typography>
              </TableCellEnrollmentDate>
              <TableCellStatus>
                <Tag $variant={statusTagVariants[attendee.status]}>
                  {getStatusLabel(attendee.status)}
                </Tag>
              </TableCellStatus>
              <TableCellActions>
                {attendee.status === 'confirmation pending' && (
                  <>
                    <Button size="small" $variant="outline" onClick={() => onApprove(attendee._id)}>
                      Aprobar
                    </Button>
                    <Button size="small" $variant="defaultDanger" onClick={() => onReject(attendee._id)}>
                      Rechazar
                    </Button>
                  </>
                )}
              </TableCellActions>
            </ListRow>
          ))}
        </List>
      </Table>
    ) : (
      <EmptyMessage>
        <MessageContainer>
          <EmptyMedia>
            <EmptyImg src="/icons/attendees-solid.svg" alt="empty state icon" />
          </EmptyMedia>
          <Typography as="p" $variant="body-1-medium" color={theme.colors.defaultStrong}>
            Aún no hay inscritos.
          </Typography>
          <Typography
            as="p"
            $variant="body-2-regular"
            color={theme.colors.defaultWeak}
            style={{ maxWidth: "280px" }}
            align="center"
          >
            Prueba a compartir el evento o invita a algún asistente.
          </Typography>
        </MessageContainer>
      </EmptyMessage>
    )}
  </ListWrapper>
);

const getStatusLabel = (status) => {
  switch (status) {
    case 'attending':
      return 'Asistirá';
    case 'confirmation pending':
      return 'Pendiente';
    case 'not attending':
      return 'No asistirá';
    default:
      return status;
  }
};

AttendeesList.propTypes = {
  attendees: PropTypes.array.isRequired,
  onApprove: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
};

export default AttendeesList;

// Estilos
const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.sizing.sm};
  width: 100%;
  padding-bottom: ${({ theme }) => theme.sizing.xl};
  padding-top: ${({ theme }) => theme.sizing.xl};
`;

const Table = styled.div`
`;

const ListHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(16, 1fr);
  grid-template-rows: 1fr;
  border-left: 1px solid ${({ theme }) => theme.border.defaultWeak};
  border-top: 1px solid ${({ theme }) => theme.border.defaultWeak};
  border-right: 1px solid ${({ theme }) => theme.border.defaultWeak};
  border-radius: ${({ theme }) => theme.radius.xs} ${({ theme }) => theme.radius.xs} 0px 0px;
`;

const ListRow = styled.li`
  display: grid;
  grid-template-columns: repeat(16, 1fr);
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.border.defaultWeak};

  &:last-child {
    border-bottom: none;
  }
`;

const HeaderCell = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-direction: row;
  padding: 8px 16px;
  // grid-column: auto;
  grid-column: span 2;
`;

const TableCell = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.sizing.sm};
  flex-direction: row;
  padding: ${({ theme }) => theme.sizing.sm};
  grid-column: span 2;
  // grid-column: auto;
`;

const HeaderCellName = styled(HeaderCell)`
 grid-column: span 4;
`;

const TableCellName = styled(TableCell)`
  grid-column: span 4;
`;


const HeaderCellVehicle = styled(HeaderCell)`
  grid-column: span 2;
`;

const TableCellVehicle = styled(TableCell)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.sizing.xxs};
  align-items: flex-start;
  grid-column: span 2;
`;

const HeaderCellTicket = styled(HeaderCell)`
`;

const TableCellTicket = styled(TableCell)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.sizing.xxs};
  align-items: flex-start;
`;


const HeaderCellStatus = styled(HeaderCell)`
  grid-column: span 3;
`;

const TableCellStatus = styled(TableCell)`
  grid-column: span 3;
`;

const HeaderCellEnrollmentDate = styled(HeaderCell)`
`;

const TableCellEnrollmentDate = styled(TableCell)`
`;

const HeaderCellActions = styled(HeaderCell)`
  grid-column: span 3;
`;

const TableCellActions = styled(TableCell)`
  grid-column: span 3;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.sizing.xs};
`;

const List = styled.ul`
  border: 1px solid ${({ theme }) => theme.border.defaultWeak};
  border-bottom-left-radius: ${({ theme }) => theme.radius.xs};
  border-bottom-right-radius: ${({ theme }) => theme.radius.xs};
`;

const Avatar = styled.img`
  width: ${({ theme }) => theme.sizing.xl};
  height: ${({ theme }) => theme.sizing.xl};
  border-radius: ${({ theme }) => theme.radius.xs};
`;

const AttendeeData = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.sizing.xxxs};
`;

const EmptyMessage = styled.div`
  padding: ${({ theme }) => theme.sizing.xxl};
  color: ${({ theme }) => theme.colors.defaultWeak};
  text-align: center;
  border: 1px solid ${({ theme }) => theme.border.defaultSubtle};
  border-radius: ${({ theme }) => theme.radius.xs};
`;

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.sizing.xxs};
`;

const EmptyMedia = styled.div`
  width: ${({ theme }) => theme.sizing.xxl};
  height: ${({ theme }) => theme.sizing.xxl};
  border-radius: ${({ theme }) => theme.radius.xs};
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.fill.defaultWeak};
  margin-bottom: ${({ theme }) => theme.sizing.xs};
`;

const EmptyImg = styled.img`
  width: ${({ theme }) => theme.sizing.md};;
  height: ${({ theme }) => theme.sizing.md};
`;