import { Select, Popover, Typography, Flex } from 'antd';

const { Paragraph, Link } = Typography;

interface BASelectProps<T> {
  options: T[];
  placeholder?: string;
  value?: string | null;
  onChange?: (value: string | null) => void;
  getValue: (option: T) => string;
  getLabel: (option: T) => string;
  getDescription?: (option: T) => string | undefined;
  getDocumentationUrl?: (option: T) => string | undefined;
  showPopover?: boolean;
  disabled?: boolean;
}

const BASelect = <T,>({
  options,
  placeholder,
  value,
  onChange,
  getValue,
  getLabel,
  getDescription,
  getDocumentationUrl,
  showPopover = false,
  disabled = false,
}: BASelectProps<T>) => {
  const renderPopoverContent = (opt: T) => {
    const description = getDescription?.(opt);
    const documentationUrl = getDocumentationUrl?.(opt);

    return (
      <Flex vertical gap='small' className='ba-select__popover-content'>
        {description && <Paragraph>{description}</Paragraph>}
        {documentationUrl && (
          <Link href={documentationUrl} target='_blank'>
            See more details →
          </Link>
        )}
      </Flex>
    );
  };

  const mappedOptions = options.map((opt) => ({
    value: getValue(opt),
    label: showPopover ? (
      <Popover
        content={renderPopoverContent(opt)}
        trigger='hover'
        placement='rightTop'
        zIndex={1060}
      >
        <span>{getLabel(opt)}</span>
      </Popover>
    ) : (
      getLabel(opt)
    ),
  }));

  return (
    <Select
      placeholder={placeholder}
      value={value}
      onChange={(val) => onChange?.(val ?? null)}
      options={mappedOptions}
      disabled={disabled}
      allowClear
      className='ba-select'
    />
  );
};

export default BASelect;
